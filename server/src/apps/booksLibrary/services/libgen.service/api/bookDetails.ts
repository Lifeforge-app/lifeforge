import { JSDOM } from 'jsdom'

import { zip } from '../utils/parsing'

export const getBookDetails = async (md5: string) => {
  const target = new URL('http://libgen.is/book/index.php')

  target.searchParams.set('md5', md5)

  const data = await fetch(target.href).then(res => res.text())

  const dom = new JSDOM(data)

  const document = dom.window.document

  const final = parseLibgenISBookDetailsPage(document)

  return final
}

export const getLocalLibraryData = async (provider: string, md5: string) => {
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
}

function parseLibgenISBookDetailsPage(document: Document) {
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

function getLibgenISLocalLibraryData(document: Document) {
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
