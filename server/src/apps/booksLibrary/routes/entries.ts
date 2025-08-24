/* eslint-disable padding-line-between-statements */
import { getAPIKey } from '@functions/database'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import { addToTaskPool, updateTaskInPool } from '@functions/socketio/taskPool'
import mailer from 'nodemailer'
import { z } from 'zod/v4'

import { SCHEMAS } from '../../../core/schema'

const list = forgeController.query
  .description('Get all entries in the books library')
  .input({
    query: z.object({
      collection: z.string().optional(),
      language: z.string().optional(),
      favourite: z
        .string()
        .optional()
        .transform(val => val === 'true'),
      fileType: z.string().optional(),
      query: z.string().optional()
    })
  })
  .existenceCheck('query', {
    collection: '[books_library__collections]',
    language: '[books_library__languages]',
    fileType: '[books_library__file_types]'
  })
  .callback(
    async ({
      pb,
      query: { collection, language, favourite, fileType, query }
    }) => {
      const fileTypeRecord = fileType
        ? await pb.getOne
            .collection('books_library__file_types')
            .id(fileType)
            .execute()
        : undefined

      return await pb.getFullList
        .collection('books_library__entries')
        .filter([
          collection
            ? {
                field: 'collection',
                operator: '=',
                value: collection
              }
            : undefined,
          language
            ? {
                field: 'languages',
                operator: '~',
                value: language
              }
            : undefined,
          favourite !== undefined
            ? {
                field: 'is_favourite',
                operator: '=',
                value: favourite
              }
            : undefined,
          fileTypeRecord && {
            field: 'extension',
            operator: '=',
            value: fileTypeRecord.name
          },
          query
            ? {
                field: 'title',
                operator: '~',
                value: query
              }
            : undefined
        ])
        .sort(['-is_favourite', '-created'])
        .execute()
    }
  )

const update = forgeController.mutation
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.books_library.entries
      .pick({
        title: true,
        authors: true,
        edition: true,
        languages: true,
        isbn: true,
        publisher: true,
        year_published: true
      })
      .extend({
        collection: z.string().optional()
      })
  })
  .description('Update an existing entry in the books library')
  .existenceCheck('query', {
    id: 'books_library__entries'
  })
  .existenceCheck('body', {
    collection: '[books_library__collections]',
    languages: '[books_library__languages]'
  })
  .callback(({ pb, query: { id }, body }) =>
    pb.update.collection('books_library__entries').id(id).data(body).execute()
  )

const toggleFavouriteStatus = forgeController.mutation
  .description('Toggle the favourite status of an entry in the books library')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'books_library__entries'
  })
  .callback(async ({ pb, query: { id } }) => {
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

const toggleReadStatus = forgeController.mutation
  .description('Toggle the read status of an entry in the books library')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'books_library__entries'
  })
  .callback(async ({ pb, query: { id } }) => {
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

const sendToKindle = forgeController.mutation
  .description('Send an entry to a Kindle email address')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: z.object({
      target: z.string().email()
    })
  })
  .existenceCheck('query', {
    id: 'books_library__entries'
  })
  .statusCode(202)
  .callback(async ({ pb, io, query: { id }, body: { target } }) => {
    const taskid = addToTaskPool(io, {
      module: 'booksLibrary',
      description: 'Send book to Kindle',
      status: 'pending'
    })

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

    ;(async () => {
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

        updateTaskInPool(io, taskid, {
          status: 'completed'
        })
      } catch (err) {
        console.error('Failed to send email:', err)
        updateTaskInPool(io, taskid, {
          status: 'failed',
          error: 'Failed to send email'
        })
      }
    })()

    return taskid
  })

const remove = forgeController.mutation
  .description('Delete an existing entry in the books library')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'books_library__entries'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('books_library__entries').id(id).execute()
  )

export default forgeRouter({
  list,
  update,
  toggleFavouriteStatus,
  toggleReadStatus,
  sendToKindle,
  remove
})
