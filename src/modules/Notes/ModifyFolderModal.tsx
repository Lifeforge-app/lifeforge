/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable multiline-ternary */
import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { toast } from 'react-toastify'
import { useDebounce } from '@uidotdev/usehooks'
import Modal from '../../components/Modal'
import { useParams } from 'react-router'
import { type INotesEntry } from './Subject'

function ModifyFolderModal({
  openType,
  setOpenType,
  updateNotesEntries,
  existedData
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  updateNotesEntries: () => void
  existedData: INotesEntry | null
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

  const [loading, setLoading] = useState(false)
  const [folderName, setFolderName] = useState('')
  const innerOpenType = useDebounce(openType, openType === null ? 300 : 0)

  function updateFolderName(e: React.ChangeEvent<HTMLInputElement>): void {
    setFolderName(e.target.value)
  }

  function onSubmitButtonClick(): void {
    if (folderName.trim().length === 0) {
      toast.error('Please fill in all the fields.')
      return
    }

    setLoading(true)

    const entry = {
      name: folderName.trim(),
      workspace,
      type: 'folder',
      parent: path !== undefined ? path.split('/').pop() : '',
      subject
    }

    fetch(
      `${import.meta.env.VITE_API_HOST}/notes/entry/${innerOpenType}/folder` +
        (innerOpenType === 'update' ? `/${existedData!.id}` : ''),
      {
        method: innerOpenType === 'create' ? 'PUT' : 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(entry)
      }
    )
      .then(async res => {
        const data = await res.json()
        if (res.status !== 200) {
          throw data.message
        }
        toast.success(
          {
            create: 'Yay! Folder created. Time to fill it up.',
            update: 'Yay! Folder renamed.'
          }[innerOpenType!]
        )
        setOpenType(null)
        updateNotesEntries()
      })
      .catch(err => {
        toast.error(
          {
            create: "Oops! Couldn't create the folder. Please try again.",
            update: "Oops! Couldn't rename the folder. Please try again."
          }[innerOpenType!] +
            ' Error: ' +
            err
        )
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (innerOpenType === 'update' && existedData !== null) {
      setFolderName(existedData.name)
    } else {
      setFolderName('')
    }
  }, [innerOpenType, existedData])

  return (
    <>
      <Modal isOpen={openType !== null}>
        <div className="mb-8 flex items-center justify-between ">
          <h1 className="flex items-center gap-3 text-2xl font-semibold">
            <Icon
              icon={
                {
                  create: 'tabler:plus',
                  update: 'tabler:pencil'
                }[innerOpenType!]
              }
              className="h-7 w-7"
            />
            {
              {
                create: 'Create ',
                update: 'Rename '
              }[innerOpenType!]
            }{' '}
            folder
          </h1>
          <button
            onClick={() => {
              setOpenType(null)
            }}
            className="rounded-md p-2 text-neutral-500 transition-all hover:bg-neutral-200/50 hover:text-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-800"
          >
            <Icon icon="tabler:x" className="h-6 w-6" />
          </button>
        </div>
        <div className="group relative flex w-[40vw] items-center gap-1 rounded-t-lg border-b-2 border-neutral-500 bg-neutral-200/50 focus-within:border-custom-500 dark:bg-neutral-800/50">
          <Icon
            icon="tabler:folder"
            className="ml-6 h-6 w-6 shrink-0 text-neutral-500 group-focus-within:text-custom-500"
          />

          <div className="flex w-full items-center gap-2">
            <span
              className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-neutral-500 group-focus-within:text-custom-500 ${
                folderName.length === 0
                  ? 'top-1/2 -translate-y-1/2 group-focus-within:top-6 group-focus-within:text-[14px]'
                  : 'top-6 -translate-y-1/2 text-[14px]'
              }`}
            >
              Folder Name
            </span>
            <input
              value={folderName}
              onChange={updateFolderName}
              placeholder="My folder"
              className="mt-6 h-8 w-full rounded-lg bg-transparent p-6 pl-4 tracking-wide placeholder:text-transparent focus:outline-none focus:placeholder:text-neutral-400"
            />
          </div>
        </div>
        <button
          disabled={loading}
          className="mt-8 flex h-16 items-center justify-center gap-2 rounded-lg bg-custom-500 p-4 pr-5 font-semibold uppercase tracking-wider text-neutral-100 transition-all hover:bg-custom-600 dark:text-neutral-800"
          onClick={onSubmitButtonClick}
        >
          {!loading ? (
            <>
              <Icon
                icon={
                  {
                    create: 'tabler:plus',
                    update: 'tabler:pencil'
                  }[innerOpenType!]
                }
                className="h-5 w-5"
              />
              {
                {
                  create: 'CREATE',
                  update: 'RENAME'
                }[innerOpenType!]
              }
            </>
          ) : (
            <span className="small-loader-dark"></span>
          )}
        </button>
      </Modal>
    </>
  )
}

export default ModifyFolderModal
