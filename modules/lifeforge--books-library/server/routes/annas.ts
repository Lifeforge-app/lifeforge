import { JSDOM } from 'jsdom'
import z from 'zod'

import forge from '../forge'

const BookResultSchema = z.object({
  md5: z.string(),
  title: z.string(),
  author: z.string().optional(),
  publisher: z.string().optional(),
  year: z.string().optional(),
  description: z.string().optional(),
  language: z.string().optional(),
  format: z.string().optional(),
  fileSize: z.string().optional(),
  type: z.string().optional(),
  coverUrl: z.string().optional(),
  filePath: z.string().optional()
})

const AnnaSearchResponseSchema = z.object({
  success: z.boolean(),
  results: z.array(BookResultSchema),
  total: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
  query: z.string(),
  error: z.string().optional()
})

export const search = forge
  .query({
    description: "Search books in Anna's Archive",
    noAuth: true,
    input: {
      query: z.object({
        q: z.string(),
        page: z.string()
      })
    },
    output: {
      OK: AnnaSearchResponseSchema
    }
  })
  .callback(async ({ query: { q, page }, response }) => {
    const parsedPage = (() => {
      const p = parseInt(page, 10)

      return isNaN(p) || p < 1 ? 1 : p
    })()

    try {
      const searchUrl = `https://annas-archive.gl/search?q=${encodeURIComponent(q)}&page=${parsedPage}`

      const res = await fetch(searchUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      })

      if (!res.ok) {
        return response.ok({
          success: false,
          error: `HTTP error! status: ${res.status}`,
          results: [],
          total: 0,
          totalPages: 1,
          currentPage: parsedPage,
          query: q
        })
      }

      const html = await res.text()

      const dom = new JSDOM(html)

      const document = dom.window.document

      const bookItems = document.querySelectorAll(
        '.js-aarecord-list-outer > div.flex'
      )

      const results: z.infer<typeof BookResultSchema>[] = []

      for (const item of bookItems) {
        try {
          const mainLink = item.querySelector('a[href*="/md5/"]')

          if (!mainLink) continue

          const href = mainLink.getAttribute('href')

          const md5Match = href?.match(/\/md5\/([a-f0-9]{32})/)

          if (!md5Match) continue

          const md5 = md5Match[1]

          const titleElement = item.querySelector(
            'a[href*="/md5/"].js-vim-focus'
          )

          const title = titleElement?.textContent?.trim() || ''

          const authorElement = item.querySelector(
            'a[href*="/search?q="] .icon-\\[mdi--user-edit\\]'
          )?.parentElement

          const author = authorElement?.textContent
            ?.replace(/^\s*\uD83D\uDC64?\s*/, '')
            .trim()

          const publisherElement = item.querySelector(
            'a[href*="/search?q="] .icon-\\[mdi--company\\]'
          )?.parentElement

          const publisherText = publisherElement?.textContent
            ?.replace(/^\s*\uD83C\uDFE2?\s*/, '')
            .trim()

          let publisher: string | undefined

          let year: string | undefined

          if (publisherText) {
            const parts = publisherText.split(', ')

            publisher = parts[0]

            const yearMatch = publisherText.match(/\b(19|20)\d{2}\b/)

            if (yearMatch) {
              year = yearMatch[0]
            }
          }

          const descriptionElement = item.querySelector(
            '.relative .line-clamp-\\[2\\].text-gray-600'
          )

          const description = descriptionElement?.textContent?.trim()

          const detailsElement = item.querySelector(
            '.text-gray-800, .dark\\:text-slate-400'
          )

          const detailsText = detailsElement?.textContent || ''

          const languageMatch = detailsText.match(/✅\s*(\w+)\s*\[(\w+)\]/)

          const language = languageMatch ? languageMatch[1] : undefined

          const formatMatch = detailsText.match(
            /·\s*(\w+)\s*·\s*([\d.]+\s*[KMGT]?B)/i
          )

          const format = formatMatch ? formatMatch[1] : undefined

          const fileSize = formatMatch ? formatMatch[2] : undefined

          const typeMatch = detailsText.match(
            /(📘\s*Book\s*\(non-fiction\)|📕\s*Book\s*\(fiction\)|📗\s*Book\s*\(unknown\)|📙\s*Book\s*\(comic\))/
          )

          let type: string | undefined

          if (typeMatch) {
            if (typeMatch[0].includes('non-fiction')) type = 'non-fiction'
            else if (typeMatch[0].includes('fiction')) type = 'fiction'
            else if (typeMatch[0].includes('unknown')) type = 'unknown'
            else if (typeMatch[0].includes('comic')) type = 'comic'
          }

          const coverImg = item.querySelector('img')

          const coverUrl = coverImg?.getAttribute('src') || undefined

          const filePathElement = item.querySelector('.text-gray-500.font-mono')

          const filePath = filePathElement?.textContent?.trim()

          results.push({
            md5,
            title,
            author,
            publisher,
            year,
            description,
            language,
            format,
            fileSize,
            type,
            coverUrl:
              coverUrl && coverUrl.startsWith('http') ? coverUrl : undefined,
            filePath
          })
        } catch {
          continue
        }
      }

      let totalPages = 1

      const paginationNav = document.querySelector(
        'nav[aria-label="Pagination"]'
      )

      if (paginationNav) {
        const pageLinks = paginationNav.querySelectorAll('a[href*="&page="]')

        for (const link of pageLinks) {
          const href = link.getAttribute('href')

          const pageMatch = href?.match(/&page=(\d+)/)

          if (pageMatch) {
            const pageNum = parseInt(pageMatch[1], 10)

            if (!isNaN(pageNum) && pageNum > totalPages) {
              totalPages = pageNum
            }
          }
        }
      }

      return response.ok({
        success: true,
        results,
        total: results.length,
        totalPages,
        currentPage: parsedPage,
        query: q
      })
    } catch (error) {
      return response.ok({
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
        results: [],
        total: 0,
        totalPages: 1,
        currentPage: parsedPage,
        query: q
      })
    }
  })
