/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Icon } from '@iconify/react'
import { useDebounce } from '@uidotdev/usehooks'
import { cookieParse } from 'pocketbase'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import CreateOrModifyButton from '../../../../components/ButtonsAndInputs/CreateOrModifyButton'
import Input from '../../../../components/ButtonsAndInputs/Input'
import Modal from '../../../../components/Modals/Modal'
import ModalHeader from '../../../../components/Modals/ModalHeader'
import { type INotesEntry } from '@typedec/Notes'

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
        (innerOpenType === 'update' ? `/${existedData?.id}` : ''),
      {
        method: innerOpenType === 'create' ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        },
        body: JSON.stringify(entry)
      }
    )
      .then(async res => {
        const data = await res.json()
        if (!res.ok) {
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
        <Input
          name="Folder Name"
          placeholder="My lovely folder"
          icon="tabler:folder"
          value={folderName}
          updateValue={updateFolderName}
          darker
          additionalClassName="w-[40vw]"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              onSubmitButtonClick()
            }
          }}
        />
        <CreateOrModifyButton
          loading={loading}
          onClick={onSubmitButtonClick}
          type={innerOpenType}
        />
      </Modal>
    </>
  )
}

export default ModifyFolderModal
