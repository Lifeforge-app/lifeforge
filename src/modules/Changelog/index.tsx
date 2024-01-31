/* eslint-disable @typescript-eslint/no-throw-literal */
/* eslint-disable @typescript-eslint/indent */
import React, { Fragment, useEffect, useState } from 'react'
import ModuleHeader from '../../components/general/ModuleHeader'
import { toast } from 'react-toastify'
import Loading from '../../components/general/Loading'
import Error from '../../components/general/Error'

interface IChangeLogVersion {
  version: string
  date_range: [string, string]
  entries: IChangeLogEntry[]
}

interface IChangeLogEntry {
  id: string
  feature: string
  description: string
}

function Changelog(): React.ReactElement {
  const [data, setData] = useState<'loading' | 'error' | IChangeLogVersion[]>(
    'loading'
  )

  function updateChangeLogEntries(): void {
    setData('loading')
    fetch(`${import.meta.env.VITE_API_HOST}/change-log/list`)
      .then(async response => {
        const data = await response.json()
        setData(data.data)

        if (response.status !== 200) {
          throw data.message
        }
      })
      .catch(() => {
        setData('error')
        toast.error('Failed to fetch data from server.')
      })
  }

  useEffect(() => {
    updateChangeLogEntries()
  }, [])

  return (
    <section className="flex h-full min-h-0 w-full flex-1 flex-col overflow-y-scroll px-8 sm:px-12">
      <ModuleHeader
        title="Change Log"
        desc="All the changes made to this application will be listed here."
      />
      {(() => {
        switch (data) {
          case 'loading':
            return <Loading />
          case 'error':
            return <Error message="Failed to fetch data." />
          default:
            return (
              <ul className="my-8 flex flex-col gap-4">
                {data.map(entry => (
                  <li
                    key={entry.version}
                    className="flex flex-col gap-2 rounded-lg bg-neutral-50 p-6 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-neutral-800/50"
                  >
                    <h3 className="mb-2 flex flex-col gap-2 text-2xl font-semibold sm:flex-row sm:items-end">
                      Ver. {entry.version}{' '}
                      <span className="mb-0.5 block text-sm">
                        (
                        {new Date(entry.date_range[0]).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }
                        )}{' '}
                        -{' '}
                        {new Date(entry.date_range[1]).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }
                        )}
                        )
                      </span>
                    </h3>
                    <ul className="flex list-inside list-disc flex-col gap-2 text-neutral-500 dark:text-neutral-400">
                      {entry.entries.map(subEntry => (
                        <li key={subEntry.id}>
                          <span className="font-semibold text-neutral-800 dark:text-neutral-100">
                            {subEntry.feature}:
                          </span>{' '}
                          <span
                            dangerouslySetInnerHTML={{
                              __html: subEntry.description.replace(
                                /<code>(.*?)<\/code>/,
                                `
                                <code class="inline-block rounded-md bg-neutral-200 p-1 px-1.5 font-['Jetbrains_Mono', text-sm shadow-[2px_2px_2px_rgba(0,0,0,0.05), dark:bg-neutral-800">$1</code>
                                `
                              )
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )
        }
      })()}
    </section>
  )
}

export default Changelog
