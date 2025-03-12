import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { cookieParse } from 'pocketbase'
import { useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'

import { Button, FAB, GoBackButton, MenuItem } from '@lifeforge/ui'

import useFetch from '@hooks/useFetch'

import {
  type INotesEntry,
  type INotesPath
} from '../../../../interfaces/notes_interfaces'

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
}) {
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
  }>(`notes/entries/path/${workspace}/${subject}/${path}`)

  const toastId = useRef<any>(undefined)
  const navigate = useNavigate()

  function uploadFiles() {
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
        }/notes/entries/upload/${workspace}/${subject}/${path}`,
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

  function uploadFolders() {
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
          }/notes/entries/upload/${workspace}/${subject}/${path}`,
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
              <Icon className="size-5" icon="tabler:upload" />
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
      <div className="flex-between z-100 relative flex w-full gap-4 sm:gap-12">
        <div
          className={clsx(
            'flex min-w-0 flex-1 items-center gap-4 font-semibold',
            typeof currentPath !== 'string'
              ? 'text-2xl sm:text-3xl'
              : 'text-2xl'
          )}
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
                      className="mt-0.5 size-7 text-red-500"
                      icon="tabler:alert-triangle"
                    />
                    Failed to fetch data from server.
                  </>
                )
              default:
                return (
                  <>
                    <div className="relative rounded-lg p-3">
                      <Icon
                        className="text-custom-500 text-2xl sm:text-3xl"
                        icon={currentPath.icon}
                      />
                      <div className="bg-custom-500 absolute left-0 top-0 size-full rounded-lg opacity-20" />
                    </div>
                    <div className="flex w-full min-w-0 flex-col gap-1">
                      <div className="text-bg-500 hidden items-center gap-1 text-sm md:flex">
                        {currentPath.path.map((path, index) => (
                          <>
                            <Link
                              key={index}
                              className={clsx(
                                'whitespace-nowrap',
                                index === currentPath.path.length - 1 &&
                                  'text-custom-500'
                              )}
                              to={`/notes/${currentPath.path
                                .slice(0, index + 1)
                                .map(path => path.id)
                                .join('/')}`}
                            >
                              {path.name.slice(0, 20) +
                                (path.name.length > 20 ? '...' : '')}
                            </Link>
                            {index !== currentPath.path.length - 1 && (
                              <Icon
                                className="text-bg-500 size-4 shrink-0"
                                icon="tabler:chevron-right"
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
          <button className="text-bg-500 hover:bg-bg-100 hover:text-bg-800 dark:hover:bg-bg-700/50 dark:hover:text-bg-100 hidden rounded-lg p-4 transition-all md:block">
            <Icon className="text-2xl" icon="tabler:search" />
          </button>
          <button className="text-bg-500 hover:bg-bg-100 hover:text-bg-800 dark:hover:bg-bg-700/50 dark:hover:text-bg-100 hidden rounded-lg p-4 transition-all md:block">
            <Icon className="text-2xl" icon="tabler:filter" />
          </button>
          <Menu as="div" className="relative z-50 hidden md:block">
            <Button as={MenuButton} icon="tabler:plus" onClick={() => {}}>
              new
            </Button>
            <MenuItems
              transition
              anchor="bottom end"
              className="bg-bg-100 dark:bg-bg-800 outline-hidden focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 mt-2 w-48 overflow-hidden overscroll-contain rounded-md shadow-lg transition duration-100 ease-out"
            >
              <MenuItem
                icon="tabler:folder-plus"
                text="New Folder"
                onClick={() => {
                  setModifyFolderModalOpenType('create')
                  setExistedData(null)
                }}
              />
              <div className="border-bg-300 dark:border-bg-700 w-full border-b" />
              <MenuItem
                icon="ci:file-upload"
                text="File upload"
                onClick={uploadFiles}
              />
              <MenuItem
                icon="ci:folder-upload"
                text="Folder upload"
                onClick={uploadFolders}
              />
            </MenuItems>
          </Menu>
          <button className="text-bg-500 hover:bg-bg-100 hover:text-bg-800 dark:hover:bg-bg-800 dark:hover:text-bg-100 rounded-lg p-4 transition-all">
            <Icon className="text-xl sm:text-2xl" icon="tabler:dots-vertical" />
          </button>
        </div>
      </div>
      <Menu>
        <FAB as={MenuButton} hideWhen="md" />
        <MenuItems
          transition
          anchor="bottom end"
          className="bg-bg-100 dark:bg-bg-800 outline-hidden focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 w-48 overflow-hidden overscroll-contain rounded-md shadow-lg transition duration-100 ease-out [--anchor-gap:8px]"
        >
          <MenuItem
            icon="tabler:folder-plus"
            text="New Folder"
            onClick={() => {
              setModifyFolderModalOpenType('create')
              setExistedData(null)
            }}
          />
          <div className="border-bg-300 dark:border-bg-700 w-full border-b" />
          <MenuItem
            icon="ci:file-upload"
            text="File upload"
            onClick={uploadFiles}
          />
          <MenuItem
            icon="ci:folder-upload"
            text="Folder upload"
            onClick={uploadFolders}
          />
        </MenuItems>
      </Menu>
    </>
  )
}

export default DirectoryHeader
