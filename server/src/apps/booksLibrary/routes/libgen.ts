import { forgeController, forgeRouter } from '@functions/routes'
import { addToTaskPool, updateTaskInPool } from '@functions/socketio/taskPool'
import { spawn } from 'child_process'
import { JSDOM } from 'jsdom'
import { z } from 'zod/v4'

import { processDownloadedFiles } from '../utils/download'
import {
  getLibgenISLocalLibraryData,
  parseLibgenIS,
  parseLibgenISBookDetailsPage,
  parseLibgenMirror
} from '../utils/libgen'

interface IBooksLibraryLibgenSearchResult {
  provider: string
  query: string
  resultsCount: string
  data: Record<string, any>[]
  page: number
}

const getStatus = forgeController.query
  .description('Get libgen service status')
  .input({})
  .callback(async () => {
    const status = await fetch('https://libgen.is/', {
      method: 'HEAD',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Connection: 'keep-alive'
      }
    })

    return status.ok
  })

const searchBooks = forgeController.query
  .description('Search books in libgen')
  .input({
    query: z.object({
      provider: z.string(),
      req: z.string(),
      page: z.string()
    })
  })
  .callback(async ({ query: { provider, req, page } }) => {
    const target = new URL(
      provider === 'libgen.is'
        ? 'http://libgen.is/search.php?lg_topic=libgen&open=0&view=detailed&res=25&column=def&phrase=0&sort=year&sortmode=DESC'
        : `https://${provider}/index.php?columns%5B%5D=t&columns%5B%5D=a&columns%5B%5D=s&columns%5B%5D=y&columns%5B%5D=p&columns%5B%5D=i&objects%5B%5D=f&objects%5B%5D=a&objects%5B%5D=p&topics%5B%5D=l&res=25&covers=on&filesuns=all&order=year&ordermode=desc`
    )

    target.searchParams.set('req', req)
    target.searchParams.set('page', page)

    try {
      const data = await fetch(target.href).then(res => res.text())

      const dom = new JSDOM(data)

      const document = dom.window.document

      let final: IBooksLibraryLibgenSearchResult['data'] = []
      let resultsCount = ''

      if (provider === 'libgen.is') {
        ;[final, resultsCount] = parseLibgenIS(document)
      } else {
        ;[final, resultsCount] = parseLibgenMirror(provider, document)
      }

      return {
        provider,
        query: req,
        resultsCount,
        data: final,
        page: parseInt(page)
      }
    } catch {
      return {
        provider,
        query: req,
        resultsCount: '',
        data: [],
        page: parseInt(page)
      }
    }
  })

const getBookDetails = forgeController.query
  .description('Get book details from libgen')
  .input({
    query: z.object({
      md5: z.string()
    })
  })
  .callback(async ({ query: { md5 } }) => {
    const target = new URL('http://libgen.is/book/index.php')

    target.searchParams.set('md5', md5)

    const data = await fetch(target.href).then(res => res.text())

    const dom = new JSDOM(data)

    const document = dom.window.document

    const final = parseLibgenISBookDetailsPage(document)

    return final as {
      image: string
      hashes: Record<string, string>
      title: string
      'Author(s)'?: string
      toc?: string
      descriptions?: string
      [key: string]: any
    }
  })

const getLocalLibraryData = forgeController.query
  .description('Get local library data for a book')
  .input({
    query: z.object({
      provider: z.string(),
      md5: z.string()
    })
  })
  .callback(async ({ query: { md5, provider } }) => {
    const target = new URL(
      provider === 'libgen.is'
        ? 'http://libgen.is/book/index.php'
        : `https://${provider}/edition.php`
    )

    target.searchParams.set('md5', md5)

    const data = await fetch(target.href).then(res => res.text())

    const dom = new JSDOM(data)

    const document = dom.window.document

    if (provider === 'libgen.is') {
      return getLibgenISLocalLibraryData(document)
    } else {
      throw new Error(
        'Only libgen.is is supported for local library data retrieval at the moment.'
      )
    }
  })

const addToLibrary = forgeController.mutation
  .description('Add a book to the library from libgen')
  .input({
    query: z.object({
      md5: z.string()
    }),
    body: z.object({
      authors: z.string(),
      thumbnail: z.string(),
      collection: z.string().optional(),
      extension: z.string(),
      edition: z.string(),
      isbn: z.string(),
      languages: z.array(z.string()),
      publisher: z.string(),
      size: z.number().int().min(0),
      title: z.string(),
      year_published: z.number().int().min(0)
    })
  })
  .statusCode(202)
  .callback(async ({ io, pb, query: { md5 }, body }) => {
    const target = `http://libgen.li/ads.php?md5=${md5}`

    const taskId = addToTaskPool(io, {
      module: 'booksLibrary',
      description: `Adding book with title "${body.title}" to library`,
      status: 'pending',
      data: {
        ...body,
        md5
      },
      progress: {
        downloaded: '0B',
        total: '0B',
        percentage: '0%',
        speed: '0B/s',
        ETA: '0'
      }
    })

    ;(async () => {
      try {
        const data = await fetch(target).then(res => res.text())

        const link = data.match(
          /<a href="(get\.php\?md5=.*?&key=.*?)"><h2>GET<\/h2><\/a>/
        )?.[1]

        if (!link) throw new Error('Failed to add to library')

        const downloadLink = `http://libgen.li/${link}`

        const downloadProcess = spawn('aria2c', [
          '--dir=./medium',
          `--out=${md5}.${body.extension}`,
          '--log-level=info',
          '-l-',
          '-x8',
          downloadLink
        ])

        downloadProcess.stdout.on('data', data => {
          data = data.toString()

          if (/ETA:/.test(data)) {
            const matches =
              /\[#\w{6} (?<downloaded>.*?)\/(?<total>.*?)\((?<percentage>.*?%)\).*?DL:(?<speed>.*?) ETA:(?<ETA>.*?)s\]/g.exec(
                data
              )

            if (matches) {
              const { downloaded, total, percentage, speed, ETA } =
                matches.groups!

              updateTaskInPool(io, taskId, {
                status: 'running',
                progress: {
                  downloaded,
                  total,
                  percentage,
                  speed,
                  ETA
                }
              })
            }
          }
        })

        downloadProcess.stderr.on('data', data => {
          throw new Error(data.toString())
        })

        downloadProcess.on('error', err => {
          throw new Error(`Download process failed: ${err.message}`)
        })

        downloadProcess.on('close', () => {
          processDownloadedFiles(pb, io, taskId, md5, body)
        })
      } catch (error) {
        updateTaskInPool(io, taskId, {
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    })()

    return taskId
  })

export default forgeRouter({
  getStatus,
  searchBooks,
  getBookDetails,
  getLocalLibraryData,
  addToLibrary
})
