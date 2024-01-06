import React from 'react'
import ModuleHeader from '../../components/ModuleHeader'

function Changelog(): React.ReactElement {
  return (
    <section className="flex h-full min-h-0 w-full flex-1 flex-col px-12">
      <ModuleHeader
        title="Change Log"
        desc="All the changes made to this application will be listed here."
      />
      <ul className="mt-8 flex flex-col gap-4">
        <li className="flex flex-col gap-2">
          <h3 className="text-2xl font-semibold">
            Ver. 24w01{' '}
            <span className="text-sm">(01 Jan 2024 - 07 Jan 2024)</span>
          </h3>
          <ul className="flex list-inside list-disc flex-col gap-2">
            <li>
              <span className="font-semibold">Idea Box:</span> Containers and
              ideas data synced to database, no more dummy data
            </li>
            <li>
              <span className="font-semibold">Idea Box:</span> Create, update,
              and delete containers and ideas from the UI
            </li>
            <li>
              <span className="font-semibold">Idea Box:</span> Search containers
              and ideas
            </li>
            <li>
              <span className="font-semibold">Idea Box:</span> Zoom image by
              clicking on it
            </li>
            <li>
              <span className="font-semibold">Idea Box:</span> Pin ideas to the
              top
            </li>
            <li>
              <span className="font-semibold">Change Log:</span> Added this
              change log with naming convention of{' '}
              <code className="inline-block rounded-md bg-neutral-200 p-1 px-1.5 font-['Jetbrains_Mono'] text-sm shadow-[2px_2px_2px_rgba(0,0,0,0.05)] dark:bg-neutral-800">
                Ver. [year]w[week number]
              </code>
            </li>
            <li>
              <span className="font-semibold">API:</span> Added API explorer at
              the root of the API
            </li>
            <li>
              <span className="font-semibold">API:</span> Integrated Code Time
              API into the main API
            </li>
            <li>
              <span className="font-semibold">UI:</span> Added backdrop blur
              when modals are open
            </li>
            <li>
              <span className="font-semibold">Code Refactor:</span> Moved API
              host into{' '}
              <code className="inline-block rounded-md bg-neutral-200 p-1 px-1.5 font-['Jetbrains_Mono'] text-sm shadow-[2px_2px_2px_rgba(0,0,0,0.05)] dark:bg-neutral-800">
                .env
              </code>
              &nbsp;file
            </li>
          </ul>
        </li>
      </ul>
    </section>
  )
}

export default Changelog
