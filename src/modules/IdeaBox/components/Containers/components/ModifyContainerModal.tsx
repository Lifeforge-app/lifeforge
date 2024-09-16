/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { useDebounce } from '@uidotdev/usehooks'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ColorInput from '@components/ButtonsAndInputs/ColorPicker/ColorInput'
import ColorPickerModal from '@components/ButtonsAndInputs/ColorPicker/ColorPickerModal'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import IconInput from '@components/ButtonsAndInputs/IconSelector/IconInput'
import IconSelector from '@components/ButtonsAndInputs/IconSelector/IconPicker'
import Input from '@components/ButtonsAndInputs/Input'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import { type IIdeaBoxContainer } from '@interfaces/ideabox_interfaces'
import APIRequest from '@utils/fetchData'

function ModifyContainerModal({
  openType,
  setOpenType,
  updateContainerList,
  existedData
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  updateContainerList: () => void
  existedData: IIdeaBoxContainer | null
}): React.ReactElement {
  const [loading, setLoading] = useState(false)
  const [containerName, setContainerName] = useState('')
  const [containerColor, setContainerColor] = useState('#FFFFFF')
  const [containerIcon, setContainerIcon] = useState('tabler:cube')
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false)
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const innerOpenType = useDebounce(openType, openType === null ? 300 : 0)

  function updateContainerName(e: React.ChangeEvent<HTMLInputElement>): void {
    setContainerName(e.target.value)
  }

  function updateContainerColor(e: React.ChangeEvent<HTMLInputElement>): void {
    setContainerColor(e.target.value)
  }

  async function onSubmitButtonClick(): Promise<void> {
    if (
      containerName.trim().length === 0 ||
      containerColor.trim().length === 0 ||
      containerIcon.trim().length === 0
    ) {
      toast.error('Please fill in all the fields.')
      return
    }

    setLoading(true)

    const container = {
      name: containerName.trim(),
      color: containerColor.trim(),
      icon: containerIcon.trim()
    }

    await APIRequest({
      endpoint:
        'idea-box/container' +
        (innerOpenType === 'update' ? `/${existedData?.id}` : ''),
      method: innerOpenType === 'create' ? 'POST' : 'PATCH',
      body: container,
      successInfo: innerOpenType,
      failureInfo: innerOpenType,
      callback: () => {
        setOpenType(null)
        updateContainerList()
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
      setContainerName(existedData.name)
      setContainerColor(existedData.color)
      setContainerIcon(existedData.icon)
    } else {
      setContainerName('')
      setContainerColor('#FFFFFF')
      setContainerIcon('tabler:cube')
    }
  }, [innerOpenType, existedData])

  return (
    <>
      <Modal isOpen={openType !== null}>
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
          } container`}
          onClose={() => {
            setOpenType(null)
          }}
        />
        <Input
          name="Container name"
          icon="tabler:cube"
          value={containerName}
          updateValue={updateContainerName}
          darker
          placeholder="My container"
        />
        <ColorInput
          name="Container color"
          color={containerColor}
          updateColor={updateContainerColor}
          setColorPickerOpen={setColorPickerOpen}
        />
        <IconInput
          name="Container icon"
          icon={containerIcon}
          setIcon={setContainerIcon}
          setIconSelectorOpen={setIconSelectorOpen}
        />
        <CreateOrModifyButton
          loading={loading}
          onClick={() => {
            onSubmitButtonClick().catch(console.error)
          }}
          type={innerOpenType}
        />
      </Modal>
      <ColorPickerModal
        isOpen={colorPickerOpen}
        setOpen={setColorPickerOpen}
        color={containerColor}
        setColor={setContainerColor}
      />
      <IconSelector
        isOpen={iconSelectorOpen}
        setOpen={setIconSelectorOpen}
        setSelectedIcon={setContainerIcon}
      />
    </>
  )
}

export default ModifyContainerModal
