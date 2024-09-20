/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import FILE_ICONS from '@constants/file_icons'
import useFetch from '@hooks/useFetch'
import { type IProjectsKEntry } from '@interfaces/projects_k_interfaces'
import APIRequest from '@utils/fetchData'

export default function ProjectFiles({
  projectData,
  refreshProjectData
}: {
  projectData: IProjectsKEntry | 'loading' | 'error'
  refreshProjectData: () => void
}): React.ReactElement {
  const [fileReplaceLoading, setFileReplaceLoading] = useState(false)
  const [fileDownloadLoading, setFileDownloadLoading] = useState(false)
  const [mediumClearLoading, setMediumClearLoading] = useState(false)
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)
  const [ip] = useFetch<string>('projects-k/ip')

  async function replaceFiles(): Promise<void> {
    setFileReplaceLoading(true)

    await APIRequest({
      endpoint: `projects-k/files/replace/${
        (projectData as IProjectsKEntry).id
      }`,
      method: 'PUT',
      successInfo: 'replace',
      failureInfo: 'replace',
      callback: refreshProjectData,
      finalCallback: () => {
        setFileReplaceLoading(false)
      }
    })
  }

  async function downloadFiles(): Promise<void> {
    setFileDownloadLoading(true)

    await APIRequest({
      endpoint: `projects-k/files/download/${
        (projectData as IProjectsKEntry).id
      }`,
      method: 'GET',
      successInfo:
        'Files are ready. Head over to your file explorer to download them.',
      failureInfo: 'download',
      finalCallback: () => {
        setFileDownloadLoading(false)
      }
    })
  }

  async function clearMedium(): Promise<void> {
    setMediumClearLoading(true)

    await APIRequest({
      endpoint: 'projects-k/files/clear-medium/',
      method: 'DELETE',
      successInfo: 'clearMedium',
      failureInfo: 'clearMedium',
      callback: refreshProjectData,
      finalCallback: () => {
        setMediumClearLoading(false)
      }
    })
  }

  async function copyToClipboard(text: string): Promise<void> {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
    } else {
      // Use the 'out of viewport hidden text area' trick
      const textArea = document.createElement('textarea')
      textArea.value = text
      // Move textarea out of the viewport so it's not visible
      textArea.style.position = 'absolute'
      textArea.style.left = '-999999px'

      document.body.prepend(textArea)
      textArea.select()

      try {
        document.execCommand('copy')
      } catch (error) {
        console.error(error)
      } finally {
        textArea.remove()
      }
    }

    setCopiedToClipboard(true)
    setTimeout(() => {
      setCopiedToClipboard(false)
    }, 3000)
  }

  async function setAsThumbnail(file: string): Promise<void> {
    await APIRequest({
      endpoint: `projects-k/files/set-thumbnail/${
        (projectData as IProjectsKEntry).id
      }`,
      method: 'PUT',
      body: { file },
      successInfo: 'thumbnail',
      failureInfo: 'thumbnail',
      callback: refreshProjectData
    })
  }

  return (
    <APIComponentWithFallback data={projectData}>
      {projectData => (
        <div className="mr-8 flex flex-1 flex-col gap-4 sm:mr-12">
          <div className="flex-between mt-6 flex text-bg-500">
            <div>
              <p className="flex items-center gap-2">
                IP Address: {ip}
                <button
                  onClick={() => {
                    copyToClipboard(ip).catch(e => {
                      throw e
                    })
                  }}
                  className="text-bg-500"
                >
                  <Icon
                    icon={copiedToClipboard ? 'tabler:check' : 'tabler:copy'}
                    className="text-base"
                  />
                </button>
              </p>
              <p>
                Last replaced:{' '}
                {projectData.last_file_replacement_time
                  ? new Date(
                      projectData.last_file_replacement_time
                    ).toLocaleString()
                  : 'N/A'}
              </p>
            </div>
            <div className="flex-center flex gap-4">
              <button
                onClick={() => {
                  clearMedium().catch(() => {})
                }}
                disabled={mediumClearLoading}
                className="flex items-center gap-2 rounded-lg bg-bg-800 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-50 shadow-custom transition-all hover:bg-bg-700"
              >
                {!mediumClearLoading ? (
                  <>
                    <Icon icon="tabler:copy-off" className="text-xl" />
                    Clear medium
                  </>
                ) : (
                  <span className="loader"></span>
                )}
              </button>
              <button
                onClick={() => {
                  replaceFiles().catch(() => {})
                }}
                disabled={fileReplaceLoading}
                className="flex items-center gap-2 rounded-lg bg-bg-800 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-50 shadow-custom transition-all hover:bg-bg-700"
              >
                {!fileReplaceLoading ? (
                  <>
                    <Icon icon="tabler:reload" className="text-xl" />
                    replace
                  </>
                ) : (
                  <span className="loader"></span>
                )}
              </button>
              <Button
                onClick={() => {
                  downloadFiles().catch(() => {})
                }}
                loading={fileReplaceLoading}
                icon={
                  fileDownloadLoading
                    ? 'svg-spinners:180-ring'
                    : 'tabler:download'
                }
              >
                {!fileDownloadLoading ? 'download' : ''}
              </Button>
            </div>
          </div>
          {projectData.files.length > 0 ? (
            <ul className="flex h-full min-h-0 flex-col divide-y divide-bg-300 overflow-y-auto dark:divide-bg-700/50">
              {projectData.files.map(file => (
                <li
                  key={file}
                  className="flex-between relative mt-0 flex min-w-0 gap-4 p-6"
                >
                  <div className="flex items-center gap-4">
                    <Icon
                      icon={
                        FILE_ICONS[
                          file.split('.').pop()! as keyof typeof FILE_ICONS
                        ] ?? 'tabler:file'
                      }
                      className="pointer-events-auto z-50 size-7 shrink-0 text-bg-500"
                    />
                    <p className="pointer-events-none z-50 flex items-center gap-4 truncate text-lg font-medium ">
                      {`${file
                        .split('.')[0]
                        .split('_')
                        .slice(0, -1)
                        .join('_')}.${file.split('.').pop()}`}
                      {file === projectData.thumb_original_filename && (
                        <span className="ml-2 flex items-center rounded-full bg-custom-500/20 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-custom-500 shadow-custom">
                          <Icon icon="tabler:photo" className="mr-2 size-3.5" />
                          Thumbnail
                        </span>
                      )}
                    </p>
                  </div>
                  <HamburgerMenu largerPadding className="relative">
                    <MenuItem
                      icon="tabler:photo"
                      onClick={() => {
                        setAsThumbnail(file).catch(() => {})
                      }}
                      text="Set as thumbnail"
                    />
                  </HamburgerMenu>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyStateScreen
              title="A bit empty in here..."
              description="No files uploaded yet. Upload your files through your file explorer and click the button below."
              icon="tabler:file-off"
            />
          )}
        </div>
      )}
    </APIComponentWithFallback>
  )
}
