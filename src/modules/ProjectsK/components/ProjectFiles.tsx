/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable multiline-ternary */
import React from 'react'
import { type IProjectsKEntry } from '..'
import APIComponentWithFallback from '../../../components/general/APIComponentWithFallback'
import { Icon } from '@iconify/react/dist/iconify.js'
import EmptyStateScreen from '../../../components/general/EmptyStateScreen'
import { toast } from 'react-toastify'
import { cookieParse } from 'pocketbase'
import FILE_ICONS from '../../../constants/file_icons'
import EntryName from '../../Notes/Subject/components/Directory/components/EntryItem/components/EntryName'

export default function ProjectFiles({
  projectData,
  refreshProjectData
}: {
  projectData: IProjectsKEntry | 'loading' | 'error'
  refreshProjectData: () => void
}): React.JSX.Element {
  async function replaceFiles(): Promise<void> {
    fetch(
      `${import.meta.env.VITE_API_HOST}/projects-k/entry/files/replace/${
        (projectData as IProjectsKEntry).id
      }`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        }
      }
    )
      .then(async response => {
        const data = await response.json()

        if (data.state !== 'success') {
          throw data.message
        }
        toast.info('Files have been replaced.')
        refreshProjectData()
      })
      .catch(error => {
        toast.error('Failed to update files. Error: ' + error)
      })
  }

  return (
    <APIComponentWithFallback data={projectData}>
      <div className="mr-8 flex flex-1 flex-col gap-8 sm:mr-12">
        {typeof projectData !== 'string' &&
          (projectData.files.length > 0 ? (
            <ul className="mt-6 flex h-full min-h-0 flex-col divide-y divide-bg-300 overflow-y-auto dark:divide-bg-700/50">
              {projectData.files.map(file => (
                <li
                  key={file}
                  className="relative mt-0 flex min-w-0 items-center gap-4 p-6"
                >
                  <Icon
                    icon={
                      FILE_ICONS[
                        file.split('.').pop()! as keyof typeof FILE_ICONS
                      ] ?? 'tabler:file'
                    }
                    className="pointer-events-auto z-50 h-7 w-7 shrink-0 text-bg-500"
                  />
                  <p className="pointer-events-none z-50 truncate text-lg font-medium text-bg-900 dark:text-bg-100">
                    {file}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyStateScreen
              title="A bit empty in here..."
              description="No files uploaded yet. Upload your files through your file explorer and click the button below."
              icon="tabler:file-off"
            />
          ))}
        <button
          onClick={() => {
            replaceFiles().catch(() => {})
          }}
          className="mb-12 flex shrink-0 items-center justify-center gap-2 rounded-lg bg-custom-500 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)]   hover:bg-custom-600 dark:text-bg-800"
        >
          <Icon icon="tabler:reload" className="h-5 w-5 shrink-0" />
          <span className="shrink-0">replace files</span>
        </button>
      </div>
    </APIComponentWithFallback>
  )
}
