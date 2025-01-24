import { Icon } from '@iconify/react'
import React from 'react'
import { GoBackButton } from '@components/buttons'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import AddToLibraryButton from './AddToLibraryButton'

interface BookDetailProps {
  image: string
  hashes: Record<string, string>
  title: string
  'Author(s)'?: string
  toc?: string
  descriptions?: string
  [key: string]: any
}

function Details({
  id,
  onClose,
  setAddToLibraryFor
}: {
  id: string
  onClose: () => void
  setAddToLibraryFor: (id: string) => void
}): React.ReactElement {
  const [book] = useFetch<BookDetailProps>(
    `books-library/libgen/details/${id}`,
    Boolean(id)
  )

  return (
    <>
      <GoBackButton onClick={onClose} />
      <div className="mt-4">
        <APIFallbackComponent data={book}>
          {data => (
            <section className="flex flex-1 flex-col justify-center gap-8 md:flex-row">
              <div className="flex-center top-0 h-full flex-col md:sticky">
                {data.image !== '../img/blank.png' ? (
                  <img
                    src={`${
                      import.meta.env.VITE_API_HOST
                    }/books-library/libgen${data.image}`}
                    className="size-full max-w-64 object-contain"
                    referrerPolicy="no-referrer"
                    alt=""
                  />
                ) : (
                  <Icon
                    icon="iconamoon:file-document-light"
                    className="h-full w-64 text-bg-400 dark:text-bg-600"
                  />
                )}
                <h2 className="mb-2 mt-4 hidden w-full text-left font-medium md:block">
                  Hashes
                </h2>
                <div className="hidden w-full flex-col gap-2 text-xs md:flex">
                  {Object.entries(data.hashes).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="mb-0.5 text-bg-400 dark:text-bg-400">
                        {key}
                      </span>
                      {value.split(' ').map((hash, i) => (
                        <span key={i} className="font-['JetBrains_Mono']">
                          {hash}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex size-full flex-col md:w-3/5 lg:w-4/5">
                <div className="flex-between flex flex-col gap-8 xl:flex-row">
                  <div>
                    <h1 className="text-3xl font-medium">{data.title}</h1>
                    <div className="mt-2 flex flex-wrap">
                      {data['Author(s)']?.split(/,|;/).map((author, i, arr) => (
                        <span key={i}>
                          <a
                            href={`/search?req=${encodeURIComponent(
                              author.trim()
                            )}&column=author`}
                            className="text-custom-500 hover:text-custom-600"
                          >
                            {author.trim()}
                          </a>
                          {i < arr.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  </div>
                  <AddToLibraryButton
                    md5={id}
                    setAddToLibraryFor={setAddToLibraryFor}
                  />
                </div>
                <table className="mt-6">
                  <tbody>
                    {Object.entries(data).map(([key, value]) => {
                      if (
                        Boolean(value) &&
                        ![
                          'image',
                          'title',
                          'Author(s)',
                          'hashes',
                          'toc',
                          'descriptions'
                        ].includes(key)
                      ) {
                        return (
                          <tr
                            key={key}
                            className="border-b border-bg-300 even:bg-bg-300/40 dark:border-bg-700 even:dark:bg-bg-800/30"
                          >
                            <td className="px-5 py-4 text-bg-500">
                              {key.split('|')[key.split('|').length - 1]}
                            </td>
                            <td className="font-light">
                              {typeof value === 'string' ? (
                                value
                              ) : key.startsWith('islink|') ? (
                                Object.entries(value).length === 1 ? (
                                  <a
                                    href={Object.entries(value)[0][1] as string}
                                    className="break-all text-custom-500 hover:text-custom-600"
                                  >
                                    {Object.entries(value)[0][0]}
                                  </a>
                                ) : (
                                  <ul className="list-inside list-disc">
                                    {Object.entries(value).map(([k, v]) => (
                                      <li key={k}>
                                        <a
                                          href={v as string}
                                          className="break-all text-custom-500 hover:text-custom-600"
                                        >
                                          {k}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                )
                              ) : Array.isArray(value) ? (
                                <ul className="list-inside list-disc py-2">
                                  {value.map((v, i) => (
                                    <li key={i} className="py-2">
                                      {Array.isArray(v) ? (
                                        <a
                                          href={v[1]}
                                          className="break-all text-custom-500 hover:text-custom-600"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {v[0]}
                                        </a>
                                      ) : (
                                        v
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="py-4 pr-4">
                                  <table className="w-full border-2 border-bg-300 dark:border-bg-700">
                                    <tbody>
                                      {Object.entries(value).map(([k, v]) => (
                                        <tr
                                          key={k}
                                          className="border-b-2 border-bg-300 dark:border-bg-700"
                                        >
                                          <td className="break-all border-r-2 border-bg-300 px-3 py-2 dark:border-bg-700">
                                            {k}
                                          </td>
                                          <td className="break-all px-3">
                                            {(v as string) ?? 'N/A'}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </td>
                          </tr>
                        )
                      }
                      return null
                    })}
                  </tbody>
                </table>
                {Object.entries({
                  descriptions: 'Descriptions',
                  toc: 'Table of Contents'
                }).map(
                  ([key, value]) =>
                    Boolean(data[key]) && (
                      <div key={key}>
                        <h2 className="mb-3 mt-6 text-2xl font-semibold">
                          {value}
                        </h2>
                        <div
                          className="font-light"
                          dangerouslySetInnerHTML={{
                            __html: data[key].replace(/^<br>/, '')
                          }}
                        />
                      </div>
                    )
                )}
              </div>
            </section>
          )}
        </APIFallbackComponent>
      </div>
    </>
  )
}

export default Details
