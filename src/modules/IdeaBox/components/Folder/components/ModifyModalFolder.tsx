/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { useDebounce } from '@uidotdev/usehooks'
import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import ColorInput from '@components/ButtonsAndInputs/ColorPicker/ColorInput'
import ColorPickerModal from '@components/ButtonsAndInputs/ColorPicker/ColorPickerModal'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import IconInput from '@components/ButtonsAndInputs/IconPicker/IconInput'
import IconSelector from '@components/ButtonsAndInputs/IconPicker/IconPickerModal'
import Input from '@components/ButtonsAndInputs/Input'
import ModalWrapper from '@components/Modals/ModalWrapper'
import ModalHeader from '@components/Modals/ModalHeader'
import { type IIdeaBoxFolder } from '@interfaces/ideabox_interfaces'
import APIRequest from '@utils/fetchData'

function ModifyFolderModal({
  openType,
  setOpenType,
  updateFolderList,
  existedData
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  updateFolderList: () => void
  existedData: IIdeaBoxFolder | null
}): React.ReactElement {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(false)
  const [folderName, setFolderName] = useState('')
  const [folderColor, setFolderColor] = useState('#FFFFFF')
  const [folderIcon, setFolderIcon] = useState('tabler:cube')
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false)
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const innerOpenType = useDebounce(openType, openType === null ? 300 : 0)

  async function onSubmitButtonClick(): Promise<void> {
    if (
      folderName.trim().length === 0 ||
      folderColor.trim().length === 0 ||
      folderIcon.trim().length === 0
    ) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    setLoading(true)

    const folder = {
      name: folderName.trim(),
      color: folderColor.trim(),
      icon: folderIcon.trim(),
      ...(innerOpenType === 'create' && { container: id })
    }

    await APIRequest({
      endpoint:
        'idea-box/folders' +
        (innerOpenType === 'update' ? `/${existedData?.id}` : ''),
      method: innerOpenType === 'create' ? 'POST' : 'PATCH',
      body: folder,
      successInfo: innerOpenType,
      failureInfo: innerOpenType,
      callback: () => {
        setOpenType(null)
        updateFolderList()
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
      setFolderName(existedData.name)
      setFolderColor(existedData.color)
      setFolderIcon(existedData.icon)
    } else {
      setFolderName('')
      setFolderColor('#FFFFFF')
      setFolderIcon('tabler:cube')
    }
  }, [innerOpenType, existedData])

  return (
    <>
      <ModalWrapper isOpen={openType !== null}>
        <ModalHeader
          icon={
            {
              create: 'tabler:plus',
              update: 'tabler:pencil'
            }[innerOpenType!]
          }
          title={`${
            {
              create: 'Create ',
              update: 'Update '
            }[innerOpenType!]
          } folder`}
          onClose={() => {
            setOpenType(null)
          }}
        />
        <Input
          name="Folder name"
          icon="tabler:cube"
          value={folderName}
          updateValue={setFolderName}
          darker
          placeholder="My folder"
        />
        <ColorInput
          name="Folder color"
          color={folderColor}
          updateColor={setFolderColor}
          setColorPickerOpen={setColorPickerOpen}
        />
        <IconInput
          name="Folder icon"
          icon={folderIcon}
          setIcon={setFolderIcon}
          setIconSelectorOpen={setIconSelectorOpen}
        />
        <CreateOrModifyButton
          loading={loading}
          onClick={() => {
            onSubmitButtonClick().catch(console.error)
          }}
          type={innerOpenType}
        />
      </ModalWrapper>
      <ColorPickerModal
        isOpen={colorPickerOpen}
        setOpen={setColorPickerOpen}
        color={folderColor}
        setColor={setFolderColor}
      />
      <IconSelector
        isOpen={iconSelectorOpen}
        setOpen={setIconSelectorOpen}
        setSelectedIcon={setFolderIcon}
      />
    </>
  )
}

export default ModifyFolderModal
