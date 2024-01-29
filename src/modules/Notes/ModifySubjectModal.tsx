/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable multiline-ternary */
import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { toast } from 'react-toastify'
import { useDebounce } from '@uidotdev/usehooks'
import IconSelector from '../../components/IconSelector'
import Modal from '../../components/Modal'
import { type INotesSubject } from './Workspace'
import { useParams } from 'react-router'

function ModifySubjectModal({
  openType,
  setOpenType,
  updateSubjectList,
  existedData
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  updateSubjectList: () => void
  existedData: INotesSubject | null
}): React.ReactElement {
  const { workspace } = useParams<{ workspace: string }>()

  const [loading, setLoading] = useState(false)
  const [subjectName, setSubjectName] = useState('')
  const [subjectDescription, setSubjectDescription] = useState('')
  const [subjectIcon, setSubjectIcon] = useState('tabler:cube')
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false)
  const innerOpenType = useDebounce(openType, openType === null ? 300 : 0)

  function updateSubjectName(e: React.ChangeEvent<HTMLInputElement>): void {
    setSubjectName(e.target.value)
  }

  function updateSubjectDescription(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    setSubjectDescription(e.target.value)
  }

  function updateSubjectIcon(e: React.ChangeEvent<HTMLInputElement>): void {
    setSubjectIcon(e.target.value)
  }

  function onSubmitButtonClick(): void {
    if (
      subjectName.trim().length === 0 ||
      subjectIcon.trim().length === 0 ||
      subjectDescription.trim().length === 0
    ) {
      toast.error('Please fill in all the fields.')
      return
    }

    setLoading(true)

    const subject = {
      title: subjectName.trim(),
      description: subjectDescription.trim(),
      icon: subjectIcon.trim(),
      workspace
    }

    fetch(
      `${import.meta.env.VITE_API_HOST}/notes/subject/${innerOpenType}` +
        (innerOpenType === 'update' ? `/${existedData!.id}` : ''),
      {
        method: innerOpenType === 'create' ? 'PUT' : 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subject)
      }
    )
      .then(async res => {
        const data = await res.json()
        if (res.status !== 200) {
          throw data.message
        }
        toast.success(
          {
            create: 'Yay! Subject created. Time to fill it up.',
            update: 'Yay! Subject updated.'
          }[innerOpenType!]
        )
        setOpenType(null)
        updateSubjectList()
      })
      .catch(err => {
        toast.error(
          {
            create: "Oops! Couldn't create the subject. Please try again.",
            update: "Oops! Couldn't update the subject. Please try again."
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
      setSubjectName(existedData.title)
      setSubjectDescription(existedData.description)
      setSubjectIcon(existedData.icon)
    } else {
      setSubjectName('')
      setSubjectDescription('')
      setSubjectIcon('tabler:cube')
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
                update: 'Update '
              }[innerOpenType!]
            }{' '}
            subject
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
        <div className="group relative flex items-center gap-1 rounded-t-lg border-b-2 border-neutral-500 bg-neutral-200/50 focus-within:border-custom-500 dark:bg-neutral-800/50">
          <Icon
            icon="tabler:book"
            className="ml-6 h-6 w-6 shrink-0 text-neutral-500 group-focus-within:text-custom-500"
          />

          <div className="flex w-full items-center gap-2">
            <span
              className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-neutral-500 group-focus-within:text-custom-500 ${
                subjectName.length === 0
                  ? 'top-1/2 -translate-y-1/2 group-focus-within:top-6 group-focus-within:text-[14px]'
                  : 'top-6 -translate-y-1/2 text-[14px]'
              }`}
            >
              Subject name
            </span>
            <input
              value={subjectName}
              onChange={updateSubjectName}
              placeholder="My subject"
              className="mt-6 h-8 w-full rounded-lg bg-transparent p-6 pl-4 tracking-wide placeholder:text-transparent focus:outline-none focus:placeholder:text-neutral-400"
            />
          </div>
        </div>
        <div className="group relative mt-6 flex items-center gap-1 rounded-t-lg border-b-2 border-neutral-500 bg-neutral-200/50 focus-within:border-custom-500 dark:bg-neutral-800/50">
          <Icon
            icon="tabler:file-text"
            className="ml-6 h-6 w-6 shrink-0 text-neutral-500 group-focus-within:text-custom-500"
          />

          <div className="flex w-full items-center gap-2">
            <span
              className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-neutral-500 group-focus-within:text-custom-500 ${
                subjectDescription.length === 0
                  ? 'top-1/2 -translate-y-1/2 group-focus-within:top-6 group-focus-within:text-[14px]'
                  : 'top-6 -translate-y-1/2 text-[14px]'
              }`}
            >
              Subject description
            </span>
            <input
              value={subjectDescription}
              onChange={updateSubjectDescription}
              placeholder="The best subject of all time"
              className="mt-6 h-8 w-full rounded-lg bg-transparent p-6 pl-4 tracking-wide placeholder:text-transparent focus:outline-none focus:placeholder:text-neutral-400"
            />
          </div>
        </div>
        <div className="group relative mt-6 flex items-center gap-1 rounded-t-lg border-b-2 border-neutral-500 bg-neutral-200/50 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] focus-within:border-custom-500 dark:bg-neutral-800/50">
          <Icon
            icon="tabler:icons"
            className="ml-6 h-6 w-6 shrink-0 text-neutral-500 group-focus-within:text-custom-500"
          />

          <div className="flex w-full items-center gap-2">
            <span
              className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-neutral-500 group-focus-within:text-custom-500 ${
                subjectIcon.length === 0
                  ? 'top-1/2 -translate-y-1/2 group-focus-within:top-6 group-focus-within:text-[14px]'
                  : 'top-6 -translate-y-1/2 text-[14px]'
              }`}
            >
              Subject icon
            </span>
            <div className="mr-12 mt-6 flex w-full items-center gap-2 pl-4">
              <Icon
                className="h-4 w-4 shrink-0 rounded-full"
                icon={subjectIcon}
              ></Icon>
              <input
                value={subjectIcon}
                onChange={updateSubjectIcon}
                placeholder="tabler:cube"
                className="h-8 w-full rounded-lg bg-transparent p-6 pl-0 tracking-wide placeholder:text-transparent focus:outline-none focus:placeholder:text-neutral-400"
              />
            </div>
            <button
              onClick={() => {
                setIconSelectorOpen(true)
              }}
              className="mr-4 shrink-0 rounded-lg p-2 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 focus:outline-none dark:hover:bg-neutral-500/30 dark:hover:text-neutral-200"
            >
              <Icon icon="tabler:chevron-down" className="h-6 w-6" />
            </button>
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
                  update: 'UPDATE'
                }[innerOpenType!]
              }
            </>
          ) : (
            <span className="small-loader-dark"></span>
          )}
        </button>
      </Modal>
      <IconSelector
        isOpen={iconSelectorOpen}
        setOpen={setIconSelectorOpen}
        setSelectedIcon={setSubjectIcon}
      />
    </>
  )
}

export default ModifySubjectModal
