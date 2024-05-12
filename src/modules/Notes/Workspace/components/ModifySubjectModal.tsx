/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable multiline-ternary */
import { useDebounce } from '@uidotdev/usehooks'
import { cookieParse } from 'pocketbase'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import CreateOrModifyButton from '@components/CreateOrModifyButton'
import IconSelector from '@components/IconSelector'
import IconInput from '@components/IconSelector/IconInput'
import Input from '@components/Input'
import Modal from '@components/Modal'
import ModalHeader from '@components/ModalHeader'
import { type INotesSubject } from '@typedec/Notes'

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
        method: innerOpenType === 'create' ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        },
        body: JSON.stringify(subject)
      }
    )
      .then(async res => {
        const data = await res.json()
        if (!res.ok) {
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
        <ModalHeader
          title={`${
            {
              create: 'Create ',
              update: 'Update '
            }[innerOpenType!]
          }subject`}
          icon={`${
            {
              create: 'tabler:plus',
              update: 'tabler:pencil'
            }[innerOpenType!]
          }`}
          onClose={() => {
            setOpenType(null)
          }}
        />
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
          setIconSelectorOpen={setIconSelectorOpen}
          setIcon={setSubjectIcon}
        />
        <CreateOrModifyButton
          loading={loading}
          onClick={onSubmitButtonClick}
          type={innerOpenType}
        />
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
