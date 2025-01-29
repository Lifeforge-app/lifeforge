import { useDebounce } from '@uidotdev/usehooks'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import { CreateOrModifyButton } from '@components/buttons'
import { TextInput } from '@components/inputs'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import { type INotesEntry } from '@interfaces/notes_interfaces'
import APIRequest from '@utils/fetchData'

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
  const { t } = useTranslation()
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

  async function onSubmitButtonClick(): Promise<void> {
    if (folderName.trim().length === 0) {
      toast.error(t('input.error.fieldEmpty'))
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

    await APIRequest({
      endpoint:
        `notes/entries/${innerOpenType}/folder` +
        (innerOpenType === 'update' ? `/${existedData?.id}` : ''),
      method: innerOpenType === 'create' ? 'POST' : 'PATCH',
      body: entry,
      successInfo: innerOpenType,
      failureInfo: innerOpenType,
      finalCallback: () => {
        setLoading(false)
      },
      callback: () => {
        setOpenType(null)
        updateNotesEntries()
      }
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
      <ModalWrapper isOpen={openType !== null}>
        <ModalHeader
          title={`${
            {
              create: 'Create ',
              update: 'Rename '
            }[innerOpenType!]
          } folder`}
          icon={
            {
              create: 'tabler:plus',
              update: 'tabler:pencil'
            }[innerOpenType!]
          }
          onClose={() => {
            setOpenType(null)
          }}
        />
        <TextInput
          name="Folder Name"
          placeholder="My lovely folder"
          icon="tabler:folder"
          value={folderName}
          updateValue={setFolderName}
          darker
          onKeyDown={e => {
            if (e.key === 'Enter') {
              onSubmitButtonClick().catch(console.error)
            }
          }}
        />
        <CreateOrModifyButton
          loading={loading}
          onClick={() => {
            onSubmitButtonClick().catch(console.error)
          }}
          type={innerOpenType}
        />
      </ModalWrapper>
    </>
  )
}

export default ModifyFolderModal
