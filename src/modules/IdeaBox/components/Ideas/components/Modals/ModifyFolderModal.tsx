import { useDebounce } from '@uidotdev/usehooks'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import { CreateOrModifyButton } from '@components/buttons'
import {
  IconInput,
  IconPickerModal,
  TextInput,
  ColorInput,
  ColorPickerModal
} from '@components/inputs'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import { useIdeaBoxContext } from '@providers/IdeaBoxProvider'
import APIRequest from '@utils/fetchData'

function ModifyFolderModal(): React.ReactElement {
  const { t } = useTranslation('modules.ideaBox')
  const {
    modifyFolderModalOpenType: openType,
    setModifyFolderModalOpenType: setOpenType,
    existedFolder: existedData,
    setFolders
  } = useIdeaBoxContext()
  const { id, '*': path } = useParams<{ id: string; '*': string }>()
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
      ...(innerOpenType === 'create' && {
        container: id,
        parent: path?.split('/').pop()
      })
    }

    await APIRequest({
      endpoint:
        'idea-box/folders' +
        (innerOpenType === 'update' ? `/${existedData?.id}` : ''),
      method: innerOpenType === 'create' ? 'POST' : 'PATCH',
      body: folder,
      successInfo: innerOpenType,
      failureInfo: innerOpenType,
      callback: res => {
        setOpenType(null)
        if (innerOpenType === 'create') {
          setFolders(prevFolders => [...prevFolders, res.data])
        } else {
          setFolders(prevFolders =>
            typeof prevFolders === 'string'
              ? prevFolders
              : prevFolders.map(folder =>
                  folder.id === res.data.id ? res.data : folder
                )
          )
        }
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
          namespace="modules.ideaBox"
          title={`folder.${innerOpenType}`}
          onClose={() => {
            setOpenType(null)
          }}
        />
        <TextInput
          darker
          icon="tabler:cube"
          name="Folder name"
          namespace="modules.ideaBox"
          placeholder="My folder"
          updateValue={setFolderName}
          value={folderName}
        />
        <ColorInput
          color={folderColor}
          name="Folder color"
          namespace="modules.ideaBox"
          setColorPickerOpen={setColorPickerOpen}
          updateColor={setFolderColor}
        />
        <IconInput
          icon={folderIcon}
          name="Folder icon"
          namespace="modules.ideaBox"
          setIcon={setFolderIcon}
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
      <ColorPickerModal
        color={folderColor}
        isOpen={colorPickerOpen}
        setColor={setFolderColor}
        setOpen={setColorPickerOpen}
      />
      <IconPickerModal
        isOpen={iconSelectorOpen}
        setOpen={setIconSelectorOpen}
        setSelectedIcon={setFolderIcon}
      />
    </>
  )
}

export default ModifyFolderModal
