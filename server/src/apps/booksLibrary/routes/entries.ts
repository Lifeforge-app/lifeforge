import { getAPIKey } from '@functions/database'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import mailer from 'nodemailer'
import { z } from 'zod/v4'

import { SCHEMAS } from '../../../core/schema'

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
    body: SCHEMAS.books_library.entries.pick({
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
    pb.update.collection('books_library__entries').id(id).data(body).execute()
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
    const book = await pb.getOne
      .collection('books_library__entries')
      .id(id)
      .execute()

    return await pb.update
      .collection('books_library__entries')
      .id(id)
      .data({
        is_favourite: !book.is_favourite
      })
      .execute()
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
    const book = await pb.getOne
      .collection('books_library__entries')
      .id(id)
      .execute()

    return await pb.update
      .collection('books_library__entries')
      .id(id)
      .data({
        is_read: !book.is_read,
        time_finished: !book.is_read ? new Date().toISOString() : ''
      })
      .execute()
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
    const smtpUser = await getAPIKey('smtp-user', pb.instance)

    const smtpPassword = await getAPIKey('smtp-pass', pb.instance)

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

    const entry = await pb.getOne
      .collection('books_library__entries')
      .id(id)
      .execute()

    const fileLink = pb.instance.files.getURL(entry, entry.file)

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
    pb.delete.collection('books_library__entries').id(id).execute()
  )

export default forgeRouter({
  getAllEntries,
  updateEntry,
  toggleFavouriteStatus,
  toggleReadStatus,
  sendToKindle,
  deleteEntry
})
