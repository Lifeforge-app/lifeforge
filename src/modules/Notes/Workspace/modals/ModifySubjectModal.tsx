/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable multiline-ternary */
import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { toast } from 'react-toastify'
import { useDebounce } from '@uidotdev/usehooks'
import Modal from '../../../../components/general/Modal'
import { useParams } from 'react-router'
import Input from '../../../../components/general/Input'
import IconInput from '../../../../components/general/IconSelector/IconInput'
import { type INotesSubject } from '../components/SubjectItem'

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
  const innerOpenType = useDebounce(openType, openType === null ? 300 : 0)

  function updateSubjectName(e: React.ChangeEvent<HTMLInputElement>): void {
    setSubjectName(e.target.value)
  }

  function updateSubjectDescription(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    setSubjectDescription(e.target.value)
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
        (innerOpenType === 'update' ? `/${existedData?.id}` : ''),
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
        <Input
          name="Subject name"
          icon="tabler:book"
          value={subjectName}
          updateValue={updateSubjectName}
          darker
          additionalClassName="w-[40vw]"
          placeholder="My Subject"
        />
        <Input
          name="Subject description"
          icon="tabler:file-text"
          value={subjectDescription}
          updateValue={updateSubjectDescription}
          darker
          additionalClassName="w-[40vw] mt-6"
          placeholder="The best subject in the world"
        />
        <IconInput
          name="Subject icon"
          icon={subjectIcon}
          setIcon={setSubjectIcon}
        />
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
    </>
  )
}

export default ModifySubjectModal
