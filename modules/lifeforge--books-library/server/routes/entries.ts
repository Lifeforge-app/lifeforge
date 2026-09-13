import dayjs from 'dayjs'
import { EPub } from 'epub2'
import { countWords } from 'epub-wordcount'
import fs from 'fs'
import mailer from 'nodemailer'
// @ts-expect-error - No types available
import pdfPageCounter from 'pdf-page-counter'
import z from 'zod'

import forge from '../forge'
import schema from '../schema'
import getEpubThumbnail from '../utils/getThumbnail'

export const list = forge
  .query({
    description:
      'Get all book entries. If the user asks for books from a specific collection, retrieve the collection ID first. Read status mapping: 1=read, 2=reading, 3=unread. Use query field for book name searches.',
    input: {
      query: z.object({
        page: z.string().default('1'),
        collection: z
          .string()
          .optional()
          .describe('Collection ID of the collection'),
        language: z.string().optional(),
        favourite: z.enum(['true', 'false']).optional(),
        readStatus: z.enum(['1', '2', '3']).optional(),
        fileType: z.string().optional(),
        query: z.string().optional()
      })
    },
    existenceCheck: {
      query: {
        collection: '[collections]',
        language: '[languages]',
        fileType: '[file_types]'
      }
    },
    output: {
      OK: z.object({
        page: z.number(),
        totalPages: z.number(),
        totalItems: z.number(),
        items: z.array(schema.entries)
      }),
      NOT_FOUND: true
    }
  })
  .callback(
    async ({
      pb,
      query: {
        collection,
        language,
        favourite,
        fileType,
        readStatus,
        query,
        page
      },
      response
    }) => {
      const parsedPage = parseInt(page, 10)
      const PER_PAGE = 20

      const fileTypeRecord = fileType
        ? await pb.getOne.collection('file_types').id(fileType).execute()
        : undefined

      const results = await pb.getFullList
        .collection('entries')
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
          favourite === 'true'
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
                value: {
                  '1': 'read',
                  '2': 'reading',
                  '3': 'unread'
                }[readStatus]
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

      return response.ok({
        page: parsedPage,
        totalPages: Math.ceil(results.length / PER_PAGE),
        totalItems: results.length,
        items: results
          .sort((a, b) => {
            const readStatusOrder = {
              reading: 1,
              unread: 2,
              read: 3
            }

            if (a.read_status !== b.read_status) {
              return (
                readStatusOrder[a.read_status] - readStatusOrder[b.read_status]
              )
            }

            if (a.read_status === 'reading') {
              return (
                new Date(b.time_started).getTime() -
                new Date(a.time_started).getTime()
              )
            }

            return (
              +b.is_favourite - +a.is_favourite ||
              a.title.localeCompare(b.title)
            )
          })
          .slice((parsedPage - 1) * PER_PAGE, parsedPage * PER_PAGE)
      })
    }
  )

export const upload = forge
  .mutation({
    description: 'Upload a new book to the library',
    input: {
      body: schema.entries
        .pick({
          title: true,
          authors: true,
          edition: true,
          size: true,
          languages: true,
          extension: true,
          isbn: true,
          publisher: true,
          year_published: true
        })
        .extend({
          collection: z.string().optional()
        })
    },
    media: {
      file: {
        optional: false,
        multiple: false
      }
    },
    output: {
      OK: z.string(),
      BAD_REQUEST: z.string()
    }
  })
  .callback(
    async ({
      pb,
      body,
      media: { file },
      core: {
        media: { retrieveMedia, convertPDFToImage }
      },
      response
    }) => {
      if (typeof file === 'string') {
        return response.badRequest('Invalid file')
      }

      let thumbnail: File | undefined = undefined
      let word_count: number | undefined = undefined
      let page_count: number | undefined = undefined

      if (file.mimetype === 'application/epub+zip') {
        const epubInstance = await EPub.createAsync(file.path)
        thumbnail = await getEpubThumbnail(epubInstance)
        word_count = await countWords(file.path)
      } else if (file.mimetype === 'application/pdf') {
        thumbnail = await convertPDFToImage(file.path)
        const buffer = fs.readFileSync(file.path)
        page_count = (await pdfPageCounter(buffer)).numpages
      }

      await pb.create
        .collection('entries')
        .data({
          ...body,
          ...(await retrieveMedia('file', file)),
          thumbnail,
          word_count,
          page_count,
          read_status: 'unread'
        })
        .execute()

      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path)
      }

      return response.ok('ok')
    }
  )

export const update = forge
  .mutation({
    input: {
      query: z.object({
        id: z.string()
      }),
      body: schema.entries
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
    },
    description: 'Update an existing book entry',
    existenceCheck: {
      query: { id: 'entries' },
      body: {
        collection: '[collections]',
        languages: '[languages]'
      }
    },
    output: {
      OK: schema.entries,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, body, response }) =>
    response.ok(
      await pb.update.collection('entries').id(id).data(body).execute()
    )
  )

export const toggleFavouriteStatus = forge
  .mutation({
    description: 'Toggle book favorite status',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'entries' }
    },
    output: {
      OK: schema.entries,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    const book = await pb.getOne.collection('entries').id(id).execute()

    return response.ok(
      await pb.update
        .collection('entries')
        .id(id)
        .data({
          is_favourite: !book.is_favourite
        })
        .execute()
    )
  })

export const toggleReadStatus = forge
  .mutation({
    description: 'Toggle book read status',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'entries' }
    },
    output: {
      OK: schema.entries,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    const book = await pb.getOne.collection('entries').id(id).execute()

    return response.ok(
      await pb.update
        .collection('entries')
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
    )
  })

export const sendToKindle = forge
  .mutation({
    description: 'Send book to Kindle email',
    input: {
      query: z.object({
        id: z.string()
      }),
      body: z.object({
        target: z.string().email()
      })
    },
    existenceCheck: {
      query: { id: 'entries' }
    },
    output: {
      OK: z.string(),
      BAD_REQUEST: z.string(),
      NOT_FOUND: true
    }
  })
  .callback(
    async ({
      pb,
      io,
      query: { id },
      body: { target },
      core: {
        api: { getAPIKey },
        tasks
      },
      response
    }) => {
      const smtpUser = await getAPIKey('smtp-user', pb)

      const smtpPassword = await getAPIKey('smtp-pass', pb)

      if (!smtpUser || !smtpPassword) {
        return response.badRequest(
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
        return response.badRequest('SMTP credentials are invalid')
      }

      const taskid = tasks.add(io, {
        module: 'booksLibrary',
        description: 'Send book to Kindle',
        status: 'pending'
      })

      ;(async () => {
        const entry = await pb.getOne.collection('entries').id(id).execute()

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

          tasks.update(io, taskid, {
            status: 'completed'
          })
        } catch (err) {
          console.error('Failed to send email:', err)
          tasks.update(io, taskid, {
            status: 'failed',
            error: 'Failed to send email'
          })
        }
      })()

      return response.ok(taskid)
    }
  )

export const getEpubMetadata = forge
  .mutation({
    description: 'Get EPUB file metadata',
    media: {
      document: {
        optional: false,
        multiple: false
      }
    },
    output: {
      OK: z.object({
        isbn: z.string(),
        title: z.string(),
        authors: z.string(),
        publisher: z.string(),
        year_published: z.string()
      }),
      BAD_REQUEST: z.string()
    }
  })
  .callback(async ({ media: { document }, response }) => {
    if (typeof document === 'string') {
      return response.badRequest('Invalid media type')
    }

    const epubInstance = await EPub.createAsync(document.path)

    const metadata = epubInstance.metadata

    if (fs.existsSync(document.path)) {
      fs.unlinkSync(document.path)
    }

    return response.ok({
      isbn: metadata.ISBN,
      title: metadata.title,
      authors: metadata.creator,
      publisher: metadata.publisher,
      year_published: dayjs(metadata.date).year().toString()
    })
  })

export const remove = forge
  .mutation({
    description: 'Delete a book entry',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'entries' }
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    await pb.delete.collection('entries').id(id).execute()

    return response.noContent()
  })
