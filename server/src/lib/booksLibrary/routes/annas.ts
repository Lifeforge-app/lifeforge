import { forgeController } from '@functions/routes'
import { JSDOM } from 'jsdom'
import z from 'zod'

interface BookResult {
  md5: string
  title: string
  author?: string
  publisher?: string
  year?: string
  description?: string
  language?: string
  format?: string
  fileSize?: string
  type?: string
  coverUrl?: string
  filePath?: string
}

export const search = forgeController
  .query()
  .description("Search for books in Anna's Archive")
  .noAuth()
  .input({
    query: z.object({
      q: z.string(),
      page: z.string().transform(val => {
        const parsed = parseInt(val, 10)

        return isNaN(parsed) || parsed < 1 ? 1 : parsed
      })
    })
  })
  .callback(async ({ query: { q, page } }) => {
    try {
      // Construct the search URL
      const searchUrl = `https://annas-archive.org/search?q=${encodeURIComponent(q)}&page=${page}`

      // Fetch the HTML content
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const html = await response.text()

      // Parse the HTML using JSDOM
      const dom = new JSDOM(html)

      const document = dom.window.document

      // Find all book result items
      const bookItems = document.querySelectorAll(
        '.js-aarecord-list-outer > div.flex'
      )

      const results: BookResult[] = []

      for (const item of bookItems) {
        try {
          // Extract MD5 hash from the main link
          const mainLink = item.querySelector('a[href*="/md5/"]')

          if (!mainLink) continue

          const href = mainLink.getAttribute('href')

          const md5Match = href?.match(/\/md5\/([a-f0-9]{32})/)

          if (!md5Match) continue

          const md5 = md5Match[1]

          // Extract title
          const titleElement = item.querySelector(
            'a[href*="/md5/"].js-vim-focus'
          )

          const title = titleElement?.textContent?.trim() || ''

          // Extract author - look for the icon and get parent element text
          const authorElement = item.querySelector(
            'a[href*="/search?q="] .icon-\\[mdi--user-edit\\]'
          )?.parentElement

          const author = authorElement?.textContent
            ?.replace(/^\s*\uD83D\uDC64?\s*/, '')
            .trim()

          // Extract publisher and year - look for company icon
          const publisherElement = item.querySelector(
            'a[href*="/search?q="] .icon-\\[mdi--company\\]'
          )?.parentElement

          const publisherText = publisherElement?.textContent
            ?.replace(/^\s*\uD83C\uDFE2?\s*/, '')
            .trim()

          let publisher: string | undefined

          let year: string | undefined

          if (publisherText) {
            // Publisher format is usually: "Publisher, Location, Year"
            const parts = publisherText.split(', ')

            publisher = parts[0]
            // Year is usually the last part or a 4-digit number

            const yearMatch = publisherText.match(/\b(19|20)\d{2}\b/)

            if (yearMatch) {
              year = yearMatch[0]
            }
          }

          // Extract description - look for the description text in the relative div
          const descriptionElement = item.querySelector(
            '.relative .line-clamp-\\[2\\].text-gray-600'
          )

          const description = descriptionElement?.textContent?.trim()

          // Extract metadata from the details line
          const detailsElement = item.querySelector(
            '.text-gray-800, .dark\\:text-slate-400'
          )

          const detailsText = detailsElement?.textContent || ''

          // Extract language - look for checkmark and language pattern
          const languageMatch = detailsText.match(/✅\s*(\w+)\s*\[(\w+)\]/)

          const language = languageMatch ? languageMatch[1] : undefined

          // Extract format and file size - look for format · size pattern
          const formatMatch = detailsText.match(
            /·\s*(\w+)\s*·\s*([\d.]+\s*[KMGT]?B)/i
          )

          const format = formatMatch ? formatMatch[1] : undefined

          const fileSize = formatMatch ? formatMatch[2] : undefined

          // Extract type (Book fiction/non-fiction, etc.) - look for book emojis
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

          // Extract cover image URL
          const coverImg = item.querySelector('img')

          const coverUrl = coverImg?.getAttribute('src') || undefined

          // Extract file path from the small gray text
          const filePathElement = item.querySelector('.text-gray-500.font-mono')

          const filePath = filePathElement?.textContent?.trim()

          const bookResult: BookResult = {
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
          }

          results.push(bookResult)
        } catch (error) {
          console.error('Error parsing book item:', error)
          // Continue with other items even if one fails
        }
      }

      // Extract pagination information
      let totalPages = 1

      const currentPage = page

      // Look for pagination controls - find the navigation element with page links
      const paginationNav = document.querySelector(
        'nav[aria-label="Pagination"]'
      )

      if (paginationNav) {
        // Find all page links and get the highest page number
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

      return {
        success: true,
        results,
        total: results.length,
        totalPages,
        currentPage,
        query: q
      }
    } catch (error) {
      console.error("Error searching Anna's Archive:", error)

      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
        results: [],
        total: 0,
        totalPages: 1,
        currentPage: page,
        query: q
      }
    }
  })
