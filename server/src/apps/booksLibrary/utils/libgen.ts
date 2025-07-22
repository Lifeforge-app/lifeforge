/* eslint-disable @typescript-eslint/no-explicit-any */
import { BooksLibraryCollectionsSchemas } from 'shared/types/collections'

const zip = (a: Array<string>, b: Array<any> | null) => {
  if (b) return Object.fromEntries(a.map((k, i) => [k, b[i]]).filter(e => e[0]))

  return a
}

export function parseLibgenIS(
  document: Document
): [
  BooksLibraryCollectionsSchemas.IBooksLibraryLibgenSearchResult['data'],
  BooksLibraryCollectionsSchemas.IBooksLibraryLibgenSearchResult['resultsCount']
] {
  const table = Array.from(
    document.querySelectorAll('body > table[rules="cols"]')
  )

  return [
    table
      .map(
        item =>
          ({
            ...Object.fromEntries(
              (
                Array.from(item.querySelectorAll('tr'))
                  .map(e => e.textContent?.trim())
                  .filter(e => e)
                  .map(e => e?.split('\n'))
                  .map(e => (e!.length % 2 ? e?.concat(['']) : e))
                  .map(e =>
                    e!.reduce((all, one, i) => {
                      const ch = Math.floor(i / 2)

                      // @ts-expect-error - hmmm
                      all[ch] = [].concat(all[ch] || [], one)

                      return all
                    }, [])
                  ) as never as [string, string][]
              )
                .flat()
                .map(e => [
                  e[0].split(':')[0],
                  e[1] || e[0].split(':')[1].trim()
                ])
            ),
            md5: Array.from(item.querySelectorAll('a'))
              .find(e => e.href.includes('?md5='))
              ?.href.split('=')?.[1],
            image: item.querySelector('img')?.src
          }) as never as Record<string, string | undefined>
      )
      .filter(e => Object.keys(e).length > 1),
    document.querySelector("font[color='grey']")?.textContent || '0'
  ]
}

export function parseLibgenMirror(
  provider: string,
  document: Document
): [
  BooksLibraryCollectionsSchemas.IBooksLibraryLibgenSearchResult['data'],
  BooksLibraryCollectionsSchemas.IBooksLibraryLibgenSearchResult['resultsCount']
] {
  return [
    Array.from(document.querySelectorAll('#tablelibgen tbody tr')).map(e => ({
      image: `https://${provider}${e.querySelector('img')?.src.replace('_small', '')}`,
      ...(() => {
        const titleElement = Array.from(e.querySelectorAll('a[title]')).filter(
          e => e.textContent?.trim()
        )[0]

        return {
          Title: titleElement.textContent?.trim() || '',
          Edition: titleElement.querySelector('i')?.textContent?.trim() || ''
        }
      })(),
      ISBN: e.querySelector("font[color='green']")?.textContent?.trim() || '',
      'Author(s)':
        e.querySelector('td:nth-child(3)')?.textContent?.trim() || '',
      Publisher: e.querySelector('td:nth-child(4)')?.textContent?.trim() || '',
      Year: e.querySelector('td:nth-child(5)')?.textContent?.trim() || '',
      Language: e.querySelector('td:nth-child(6)')?.textContent?.trim() || '',
      Pages: e.querySelector('td:nth-child(7)')?.textContent?.trim() || '',
      Size:
        parseInt(
          e.querySelector('td:nth-child(8)')?.textContent?.trim() || '0'
        ) * 1000000,
      Extension: e.querySelector('td:nth-child(9)')?.textContent?.trim() || '',
      md5: (
        e.querySelector("a[href*='md5=']") as HTMLAnchorElement
      )?.href.split('=')?.[1]
    })),
    ''
  ]
}

export function parseLibgenISBookDetailsPage(document: Document) {
  const final = Object.fromEntries(
    Array.from(
      document.querySelectorAll('body > table[rules="cols"] > tbody > tr')
    )
      .slice(2)
      .map(e =>
        !e.querySelector('table')
          ? Array.from(e.querySelectorAll('td'))
              .reduce((all: HTMLTableCellElement[][], one, i) => {
                const ch = Math.floor(i / 2)

                all[ch] = ([] as HTMLTableCellElement[]).concat(
                  all[ch] || [],
                  one as HTMLTableCellElement
                )

                return all
              }, [])
              .map(e => {
                const key = e[0]?.textContent?.trim().replace(/:$/, '') || ''

                if (e[1]?.querySelector('a')) {
                  return [
                    'islink|' + key,
                    Object.fromEntries(
                      Array.from(e[1].querySelectorAll('a')).map(e => [
                        e.textContent?.trim() || '',
                        (() => {
                          const href = e.href

                          switch (key) {
                            case 'BibTeX':
                              return href.replace('bibtex.php', '/bibtex')
                            case 'Desr. old vers.':
                              return href.replace('../book/index.php', '/book')
                            default:
                              return href
                          }
                        })()
                      ])
                    )
                  ]
                }

                return [key, e[1]?.textContent?.trim() || '']
              })
          : [
              [
                e.querySelector('td')?.textContent?.trim(),
                zip(
                  ...(Array.from(e?.querySelectorAll('table > tbody > tr')).map(
                    e =>
                      Array.from(e.querySelectorAll('td')).map(e => {
                        if (e.querySelector('a')) {
                          return [
                            e.querySelector('a')?.textContent?.trim(),
                            e
                              .querySelector('a')
                              ?.href.replace('../', 'http://libgen.is/')
                          ]
                        }

                        return e.textContent?.trim()
                      })
                  ) as [Array<string>, Array<any> | null])
                )
              ]
            ]
      )
      .flat()
      .filter(e => e?.length === 2 && e[0] !== 'Table of contents' && e[1])
      .map(e => [e[0] as string, e[1]]) as [string, any][]
  )

  final.image = document.querySelector('img')?.src ?? ''

  final.title =
    document
      .querySelector(
        'body > table[rules="cols"] > tbody > tr:nth-child(2) > td:nth-child(3)'
      )
      ?.textContent?.trim() ?? ''

  final.hashes = Object.fromEntries(
    Array.from(document.querySelectorAll('table.hashes > tbody > tr'))
      .map(e => [
        e.querySelector('th')?.textContent,
        e.querySelector('td')?.textContent
      ])
      .filter(e => e[0])
  )

  final.descriptions = document.querySelector(
    'body > table[rules="cols"] > tbody > tr:nth-last-child(4) > td'
  )?.innerHTML

  final.toc = document
    .querySelector(
      'body > table[rules="cols"] > tbody > tr:nth-last-child(3) > td'
    )
    ?.innerHTML.replace(
      '<hr><font color="gray">Table of contents : <br></font>',
      ''
    )

  return final
}

export function getLibgenISLocalLibraryData(document: Document) {
  const everything = parseLibgenISBookDetailsPage(document)

  return {
    md5: everything['MD5'],
    thumbnail: document.querySelector('img')?.src ?? '',
    authors: everything['Author(s)']
      ?.split(',')
      .map((e: string) => e.trim())
      .join(', '),
    edition: everything['Edition'],
    extension: everything['Extension'],
    isbn: everything['ISBN']
      ?.split(',')
      .map((e: string) => e.trim())
      .join(', '),
    languages: everything['Language']?.split(',').map((e: string) => e.trim()),
    publisher: everything['Publisher'],
    size: everything['Size'].match(/.*?\((\d+) bytes\)/)?.[1],
    title:
      document
        .querySelector(
          'body > table[rules="cols"] > tbody > tr:nth-child(2) > td:nth-child(3)'
        )
        ?.textContent?.trim() ?? '',
    year_published: everything['Year']
  }
}
