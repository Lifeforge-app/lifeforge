import ClientError from '@functions/ClientError'
import { forgeController } from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'
import { getAPIKey } from '@functions/getAPIKey'
import mailer from 'nodemailer'
import { z } from 'zod/v4'

import {
  BooksLibraryCollectionsSchemas,
  ISchemaWithPB
} from 'shared/types/collections'

const getAllEntries = forgeController
  .route('GET /')
  .description('Get all entries in the books library')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList
      .collection('books_library__entries')
      .sort(['-is_favourite', '-created'])
      .execute()
  )

const updateEntry = forgeController
  .route('PATCH /:id')
  .input({
    params: z.object({
      id: z.string()
    }),
    body: BooksLibraryCollectionsSchemas.Entry.pick({
      title: true,
      authors: true,
      collection: true,
      edition: true,
      languages: true,
      isbn: true,
      publisher: true,
      year_published: true
    })
  })
  .description('Update an existing entry in the books library')
  .existenceCheck('params', {
    id: 'books_library__entries'
  })
  .existenceCheck('body', {
    collection: '[books_library__categories]',
    languages: '[books_library__languages]'
  })
  .callback(({ pb, params: { id }, body }) =>
    pb
      .collection('books_library__entries')
      .update<ISchemaWithPB<BooksLibraryCollectionsSchemas.IEntry>>(id, body)
  )

const toggleFavouriteStatus = forgeController
  .route('POST /favourite/:id')
  .description('Toggle the favourite status of an entry in the books library')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'books_library__entries'
  })
  .callback(async ({ pb, params: { id } }) => {
    const book = await pb
      .collection('books_library__entries')
      .getOne<ISchemaWithPB<BooksLibraryCollectionsSchemas.IEntry>>(id)

    return await pb
      .collection('books_library__entries')
      .update<ISchemaWithPB<BooksLibraryCollectionsSchemas.IEntry>>(id, {
        is_favourite: !book.is_favourite
      })
  })

const toggleReadStatus = forgeController
  .route('POST /read/:id')
  .description('Toggle the read status of an entry in the books library')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'books_library__entries'
  })
  .callback(async ({ pb, params: { id } }) => {
    const book = await pb
      .collection('books_library__entries')
      .getOne<ISchemaWithPB<BooksLibraryCollectionsSchemas.IEntry>>(id)

    return await pb
      .collection('books_library__entries')
      .update<ISchemaWithPB<BooksLibraryCollectionsSchemas.IEntry>>(id, {
        is_read: !book.is_read,
        time_finished: !book.is_read ? new Date().toISOString() : ''
      })
  })

const sendToKindle = forgeController
  .route('POST /send-to-kindle/:id')
  .description('Send an entry to a Kindle email address')
  .input({
    params: z.object({
      id: z.string()
    }),
    body: z.object({
      target: z.string().email()
    })
  })
  .existenceCheck('params', {
    id: 'books_library__entries'
  })
  .callback(async ({ pb, params: { id }, body: { target } }) => {
    const smtpUser = await getAPIKey('smtp-user', pb)

    const smtpPassword = await getAPIKey('smtp-pass', pb)

    if (!smtpUser || !smtpPassword) {
      throw new ClientError(
        'SMTP user or password not found. Please set them in the API Keys module.'
      )
    }

    const transporter = mailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPassword
      }
    })

    try {
      await transporter.verify()
    } catch {
      throw new ClientError('SMTP credentials are invalid')
    }

    const entry = await pb
      .collection('books_library__entries')
      .getOne<BooksLibraryCollectionsSchemas.IEntry>(id)

    const fileLink = pb.files.getURL(entry, entry.file)

    const content = await fetch(fileLink).then(res => res.arrayBuffer())

    const fileName = `${entry.title}.${entry.extension}`

    const mail = {
      from: `"Lifeforge Books Library" <${smtpUser}>`,
      to: target,
      subject: '',
      text: `Here is your book: ${entry.title}`,
      attachments: [
        {
          filename: fileName,
          content: Buffer.from(content)
        }
      ],
      headers: {
        'X-SES-CONFIGURATION-SET': 'Kindle'
      }
    }

    try {
      await transporter.sendMail(mail)
    } catch (err) {
      throw new Error('Failed to send email to Kindle: ' + err)
    }
  })

const deleteEntry = forgeController
  .route('DELETE /:id')
  .description('Delete an existing entry in the books library')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'books_library__entries'
  })
  .statusCode(204)
  .callback(({ pb, params: { id } }) =>
    pb.collection('books_library__entries').delete(id)
  )

export default forgeRouter({
  getAllEntries,
  updateEntry,
  toggleFavouriteStatus,
  toggleReadStatus,
  sendToKindle,
  deleteEntry
})
