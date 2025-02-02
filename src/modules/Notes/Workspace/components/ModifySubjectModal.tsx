import { useDebounce } from '@uidotdev/usehooks'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import { CreateOrModifyButton } from '@components/buttons'
import { IconInput, IconPickerModal, TextInput } from '@components/inputs'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import { type INotesSubject } from '@interfaces/notes_interfaces'
import APIRequest from '@utils/fetchData'

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
  const { t } = useTranslation('modules.notes')
  const { workspace } = useParams<{ workspace: string }>()
  const [loading, setLoading] = useState(false)
  const [subjectName, setSubjectName] = useState('')
  const [subjectDescription, setSubjectDescription] = useState('')
  const [subjectIcon, setSubjectIcon] = useState('tabler:cube')
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false)
  const innerOpenType = useDebounce(openType, openType === null ? 300 : 0)

  async function onSubmitButtonClick(): Promise<void> {
    if (
      subjectName.trim().length === 0 ||
      subjectIcon.trim().length === 0 ||
      subjectDescription.trim().length === 0
    ) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    setLoading(true)

    const subject = {
      title: subjectName.trim(),
      description: subjectDescription.trim(),
      icon: subjectIcon.trim(),
      workspace
    }

    await APIRequest({
      endpoint:
        'notes/subject' +
        (innerOpenType === 'update' ? `/${existedData?.id}` : ''),
      method: innerOpenType === 'create' ? 'POST' : 'PATCH',
      body: subject,
      successInfo: innerOpenType,
      failureInfo: innerOpenType,
      callback: () => {
        setOpenType(null)
        updateSubjectList()
      },
      onFailure: () => {
        setOpenType(null)
      },
      finalCallback: () => {
        setLoading(false)
      }
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
      <ModalWrapper isOpen={openType !== null}>
        <ModalHeader
          icon={`${
            {
              create: 'tabler:plus',
              update: 'tabler:pencil'
            }[innerOpenType!]
          }`}
          title={`${
            {
              create: 'Create ',
              update: 'Update '
            }[innerOpenType!]
          }subject`}
          onClose={() => {
            setOpenType(null)
          }}
        />
        <TextInput
          darker
          className="w-[40vw]"
          icon="tabler:book"
          name="Subject name"
          namespace="modules.notes"
          placeholder="My Subject"
          updateValue={setSubjectName}
          value={subjectName}
        />
        <TextInput
          darker
          className="mt-6 w-[40vw]"
          icon="tabler:file-text"
          name="Subject description"
          namespace="modules.notes"
          placeholder="The best subject in the world"
          updateValue={setSubjectDescription}
          value={subjectDescription}
        />
        <IconInput
          icon={subjectIcon}
          name="Subject icon"
          namespace="modules.notes"
          setIcon={setSubjectIcon}
          setIconSelectorOpen={setIconSelectorOpen}
        />
        <CreateOrModifyButton
          loading={loading}
          type={innerOpenType}
          onClick={() => {
            onSubmitButtonClick().catch(console.error)
          }}
        />
      </ModalWrapper>
      <IconPickerModal
        isOpen={iconSelectorOpen}
        setOpen={setIconSelectorOpen}
        setSelectedIcon={setSubjectIcon}
      />
    </>
  )
}

export default ModifySubjectModal
