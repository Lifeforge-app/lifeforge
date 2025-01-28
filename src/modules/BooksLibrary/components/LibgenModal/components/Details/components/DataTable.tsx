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
            href={Object.entries(value)[0][1] as string}
            className="break-all text-custom-500 hover:text-custom-600"
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
                href={v as string}
                className="break-all text-custom-500 hover:text-custom-600"
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
      )
    }

    return (
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
                <td className="break-all px-3">{(v as string) ?? 'N/A'}</td>
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
                className="border-b border-bg-300 even:bg-bg-300/40 dark:border-bg-700 dark:even:bg-bg-800/30"
              >
                <td className="px-5 py-4 text-bg-500">
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
