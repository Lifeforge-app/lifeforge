/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/indent */
import { Menu, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import GoBackButton from '@components/GoBackButton'
import MenuItem from '@components/HamburgerMenu/MenuItem'
import { type INotesEntry, type INotesPath } from '../../..'
import { toast } from 'react-toastify'
import useFetch from '@hooks/useFetch'
import { cookieParse } from 'pocketbase'

function DirectoryHeader({
  updateNotesEntries,
  setModifyFolderModalOpenType,
  setExistedData
}: {
  updateNotesEntries: () => void
  setModifyFolderModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: React.Dispatch<React.SetStateAction<INotesEntry | null>>
}): React.ReactElement {
  const {
    workspace,
    subject,
    '*': path
  } = useParams<{
    workspace: string
    subject: string
    '*': string
  }>()

  const [currentPath] = useFetch<{
    icon: string
    path: INotesPath[]
  }>(`notes/entry/path/${workspace}/${subject}/${path}`)

  const toastId = React.useRef<any>()
  const navigate = useNavigate()

  function uploadFiles(): void {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.multiple = true
    fileInput.click()

    fileInput.addEventListener('change', () => {
      const files = fileInput.files

      if (files === null) {
        return
      }

      const formData = new FormData()

      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i], encodeURIComponent(files[i].name))
      }

      formData.append(
        'parent',
        path !== undefined ? path.split('/').pop()! : ''
      )

      fetch(
        `${
          import.meta.env.VITE_API_HOST
        }/notes/entry/upload/${workspace}/${subject}/${path}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${cookieParse(document.cookie).token}`
          },
          body: formData
        }
      )
        .then(async response => {
          const data = await response.json()

          if (response.status !== 200) {
            throw data.message
          }

          toast.success('Yay! Files uploaded.')

          updateNotesEntries()
        })
        .catch(err => {
          toast.error('Failed to upload files. Error: ' + err)
        })
    })
  }

  function uploadFolders(): void {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.multiple = true
    // @ts-expect-error - idk what is this
    fileInput.directory = true
    fileInput.webkitdirectory = true
    fileInput.click()

    fileInput.addEventListener('change', async () => {
      const files = fileInput.files

      let uploaded = 0

      if (files === null) {
        return
      }

      const filesChunk = []

      for (let i = 0; i < files.length; i += 10) {
        filesChunk.push(Array.from(files).slice(i, i + 10))
      }

      for (const chunk of filesChunk) {
        const formData = new FormData()

        for (let i = 0; i < chunk.length; i++) {
          formData.append(
            'files',
            chunk[i],
            encodeURIComponent(chunk[i].webkitRelativePath)
          )
        }

        formData.append(
          'parent',
          path !== undefined ? path.split('/').pop()! : ''
        )

        await fetch(
          `${
            import.meta.env.VITE_API_HOST
          }/notes/entry/upload/${workspace}/${subject}/${path}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${cookieParse(document.cookie).token}`
            },
            body: formData
          }
        )
          .then(async response => {
            const data = await response.json()

            if (response.status !== 200) {
              throw data.message
            }
          })
          .catch(err => {
            toast.error('Failed to upload folders. Error: ' + err)
          })

        uploaded += chunk.length

        const progress = uploaded / files.length

        // check if we already displayed a toast
        if (toastId.current === undefined) {
          toastId.current = toast(
            <span className="flex items-center gap-2">
              <Icon icon="tabler:upload" className="h-5 w-5" />
              <span>Uploading folders...</span>
            </span>,
            { progress }
          )
        } else {
          toast.update(toastId.current, { progress })
        }
      }

      updateNotesEntries()

      toast.done(toastId.current)
      toast.dismiss(toastId.current)
      toastId.current = undefined
      toast.success('Yay! Folders uploaded.')
    })
  }

  return (
    <>
      <GoBackButton
        onClick={() => {
          navigate(
            `/notes/${(() => {
              if (path === undefined || path === '') {
                return subject !== undefined ? workspace : '/'
              }

              const pathArray = path.split('/')
              pathArray.pop()
              return `${workspace}/${subject}/${pathArray.join('/')}`
            })()}`
          )
        }}
      />
      <div className="relative z-[100] flex w-full items-center justify-between gap-4 sm:gap-12">
        <div
          className={`flex min-w-0 flex-1 items-center gap-4 ${
            typeof currentPath !== 'string'
              ? 'text-2xl sm:text-3xl'
              : 'text-2xl'
          } font-semibold`}
        >
          {(() => {
            switch (currentPath) {
              case 'loading':
                return (
                  <>
                    <span className="small-loader-light"></span>
                    Loading...
                  </>
                )
              case 'error':
                return (
                  <>
                    <Icon
                      icon="tabler:alert-triangle"
                      className="mt-0.5 h-7 w-7 text-red-500"
                    />
                    Failed to fetch data from server.
                  </>
                )
              default:
                return (
                  <>
                    <div className="relative rounded-lg p-3">
                      <Icon
                        icon={currentPath.icon}
                        className="text-2xl text-custom-500 sm:text-3xl"
                      />
                      <div className="absolute left-0 top-0 h-full w-full rounded-lg bg-custom-500 opacity-20" />
                    </div>
                    <div className="flex w-full min-w-0 flex-col gap-1">
                      <div className="hidden items-center gap-1 text-sm text-bg-500 md:flex">
                        {currentPath.path.map((path, index) => (
                          <>
                            <Link
                              to={`/notes/${currentPath.path
                                .slice(0, index + 1)
                                .map(path => path.id)
                                .join('/')}`}
                              key={index}
                              className={`${
                                index === currentPath.path.length - 1
                                  ? 'text-custom-500'
                                  : ''
                              } whitespace-nowrap`}
                            >
                              {path.name.slice(0, 20) +
                                (path.name.length > 20 ? '...' : '')}
                            </Link>
                            {index !== currentPath.path.length - 1 && (
                              <Icon
                                icon="tabler:chevron-right"
                                className="h-4 w-4 shrink-0 text-bg-500"
                              />
                            )}
                          </>
                        ))}
                      </div>
                      <h1 className="w-full truncate">
                        {currentPath.path[currentPath.path.length - 1].name}
                      </h1>
                    </div>
                  </>
                )
            }
          })()}
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-700/50 dark:hover:text-bg-100 md:block">
            <Icon icon="tabler:search" className="text-2xl" />
          </button>
          <button className="hidden rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-700/50 dark:hover:text-bg-100 md:block">
            <Icon icon="tabler:filter" className="text-2xl" />
          </button>
          <Menu as="div" className="relative z-50 hidden md:block">
            <Menu.Button className="flex items-center gap-2 rounded-lg bg-custom-500 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] transition-all hover:bg-custom-600 dark:text-bg-800">
              <Icon icon="tabler:plus" className="text-xl" />
              new
            </Menu.Button>
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
              className="absolute right-0 top-8"
            >
              <Menu.Items className="mt-6 w-48 overflow-hidden overscroll-contain rounded-md bg-bg-100 shadow-lg outline-none focus:outline-none dark:bg-bg-800">
                <MenuItem
                  onClick={() => {
                    setModifyFolderModalOpenType('create')
                    setExistedData(null)
                  }}
                  icon="tabler:folder-plus"
                  text="New Folder"
                />
                <div className="w-full border-b border-bg-300 dark:border-bg-700" />
                <MenuItem
                  onClick={uploadFiles}
                  icon="ci:file-upload"
                  text="File upload"
                />
                <MenuItem
                  onClick={uploadFolders}
                  icon="ci:folder-upload"
                  text="Folder upload"
                />
              </Menu.Items>
            </Transition>
          </Menu>
          <button className="rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-800 dark:hover:text-bg-100">
            <Icon icon="tabler:dots-vertical" className="text-xl sm:text-2xl" />
          </button>
        </div>
      </div>
      <Menu as="div" className="absolute bottom-8 right-8 z-50 md:hidden">
        <Menu.Button className="flex items-center gap-2 rounded-lg bg-custom-500 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] transition-all hover:bg-custom-600 dark:text-bg-800">
          <Icon icon="tabler:plus" className="text-xl" />
          new
        </Menu.Button>
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
          className="absolute right-0 top-8"
        >
          <Menu.Items className="mt-6 w-48 overflow-hidden overscroll-contain rounded-md bg-bg-100 shadow-lg outline-none focus:outline-none dark:bg-bg-800">
            <MenuItem
              onClick={() => {
                setModifyFolderModalOpenType('create')
                setExistedData(null)
              }}
              icon="tabler:folder-plus"
              text="New Folder"
            />
            <div className="w-full border-b border-bg-300 dark:border-bg-700" />
            <MenuItem
              onClick={uploadFiles}
              icon="ci:file-upload"
              text="File upload"
            />
            <MenuItem
              onClick={uploadFolders}
              icon="ci:folder-upload"
              text="Folder upload"
            />
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  )
}

export default DirectoryHeader
