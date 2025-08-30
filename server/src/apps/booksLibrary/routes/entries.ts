/* eslint-disable padding-line-between-statements */
import { getAPIKey } from '@functions/database'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import { addToTaskPool, updateTaskInPool } from '@functions/socketio/taskPool'
import { EPub } from 'epub2'
import moment from 'moment'
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
      readStatus: z
        .enum(['1', '2', '3'])
        .optional()
        .transform(val => {
          switch (val) {
            case '1':
              return 'read'
            case '2':
              return 'reading'
            case '3':
              return 'unread'
          }
        }),
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
      query: { collection, language, favourite, fileType, readStatus, query }
    }) => {
      const fileTypeRecord = fileType
        ? await pb.getOne
            .collection('books_library__file_types')
            .id(fileType)
            .execute()
        : undefined

      return (
        await pb.getFullList
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
            favourite === true
              ? {
                  field: 'is_favourite',
                  operator: '=',
                  value: true
                }
              : undefined,
            readStatus
              ? {
                  field: 'read_status',
                  operator: '=',
                  value: readStatus
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
          .execute()
      ).sort((a, b) => {
        // First sort by read status (reading -> unread -> read).
        // If the read status is the same, sort by time started (newest first).
        // Otherwise, sort by favourite status (favourite -> normal), then by title

        const readStatusOrder = {
          reading: 1,
          unread: 2,
          read: 3
        }

        if (a.read_status !== b.read_status) {
          return readStatusOrder[a.read_status] - readStatusOrder[b.read_status]
        }

        if (a.read_status === 'reading') {
          return (
            new Date(b.time_started).getTime() -
            new Date(a.time_started).getTime()
          )
        }

        return (
          +b.is_favourite - +a.is_favourite || a.title.localeCompare(b.title)
        )
      })
    }
  )

const upload = forgeController.mutation
  .description('Upload a new entry to the books library')
  .input({
    body: SCHEMAS.books_library.entries.pick({
      title: true,
      authors: true,
      edition: true,
      languages: true,
      isbn: true,
      publisher: true,
      year_published: true
    })
  })
  .media({
    file: {
      optional: false,
      multiple: false
    }
  })
  .callback(async ({ pb, body, media: { file } }) => {
    pb.create.collection('books_library__entries').data(body).execute()
  })

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
        read_status: {
          unread: 'reading',
          read: 'unread',
          reading: 'read'
        }[book.read_status],
        time_finished: {
          unread: undefined,
          read: '',
          reading: new Date().toISOString()
        }[book.read_status],
        time_started: {
          unread: new Date().toISOString(),
          read: '',
          reading: undefined
        }[book.read_status]
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

const getEpubMetadata = forgeController.mutation
  .description('Get metadata for an EPUB file')
  .input({})
  .media({
    file: {
      optional: false,
      multiple: false
    }
  })
  .callback(async ({ media: { file } }) => {
    if (typeof file === 'string') {
      throw new ClientError('Invalid media type')
    }

    const epubInstance = await EPub.createAsync(file.path)

    const metadata = epubInstance.metadata

    return {
      isbn: metadata.ISBN,
      title: metadata.title,
      authors: metadata.creator,
      publisher: metadata.publisher,
      year_published: moment(metadata.date).year(),
      languages: [metadata.language],
      size: file.size
    }
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
  upload,
  update,
  toggleFavouriteStatus,
  toggleReadStatus,
  sendToKindle,
  getEpubMetadata,
  remove
})
