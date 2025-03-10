import React from 'react'
import { BookDetailProps } from '..'

function DataTable({ data }: { data: BookDetailProps }): React.ReactElement {
  const renderContent = (key: string, value: any) => {
    if (typeof value === 'string') {
      return value
    }

    if (key.startsWith('islink|')) {
      if (Object.entries(value).length === 1) {
        return (
          <a
            className="text-custom-500 hover:text-custom-600 break-all"
            href={Object.entries(value)[0][1] as string}
          >
            {Object.entries(value)[0][0]}
          </a>
        )
      }

      return (
        <ul className="list-inside list-disc">
          {Object.entries(value).map(([k, v]) => (
            <li key={k}>
              <a
                className="text-custom-500 hover:text-custom-600 break-all"
                href={v as string}
              >
                {k}
              </a>
            </li>
          ))}
        </ul>
      )
    }

    if (Array.isArray(value)) {
      return (
        <ul className="list-inside list-disc py-2">
          {value.map((v, i) => (
            <li key={i} className="py-2">
              {Array.isArray(v) ? (
                <a
                  className="text-custom-500 hover:text-custom-600 break-all"
                  href={v[1]}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {v[0]}
                </a>
              ) : (
                v
              )}
            </li>
          ))}
        </ul>
      )
    }

    return (
      <div className="py-4 pr-4">
        <table className="border-bg-300 dark:border-bg-700 w-full border-2">
          <tbody>
            {Object.entries(value).map(([k, v]) => (
              <tr
                key={k}
                className="border-bg-300 dark:border-bg-700 border-b-2"
              >
                <td className="border-bg-300 dark:border-bg-700 border-r-2 px-3 py-2 break-all">
                  {k}
                </td>
                <td className="px-3 break-all">{(v as string) ?? 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
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
                className="border-bg-300 even:bg-bg-300/40 dark:border-bg-700 dark:even:bg-bg-800/30 border-b"
              >
                <td className="text-bg-500 px-5 py-4">
                  {key.split('|')[key.split('|').length - 1]}
                </td>
                <td className="font-light">{renderContent(key, value)}</td>
              </tr>
            )
          }
          return null
        })}
      </tbody>
    </table>
  )
}

export default DataTable
