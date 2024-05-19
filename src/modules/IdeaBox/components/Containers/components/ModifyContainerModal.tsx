/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { useDebounce } from '@uidotdev/usehooks'
import { cookieParse } from 'pocketbase'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ColorInput from '../../../../../components/ButtonsAndInputs/ColorPicker/ColorInput'
import ColorPickerModal from '../../../../../components/ButtonsAndInputs/ColorPicker/ColorPickerModal'
import CreateOrModifyButton from '../../../../../components/ButtonsAndInputs/CreateOrModifyButton'
import IconSelector from '../../../../../components/ButtonsAndInputs/IconSelector'
import IconInput from '../../../../../components/ButtonsAndInputs/IconSelector/IconInput'
import Input from '../../../../../components/ButtonsAndInputs/Input'
import Modal from '../../../../../components/Modals/Modal'
import ModalHeader from '../../../../../components/Modals/ModalHeader'
import { type IIdeaBoxContainer } from '@typedec/IdeaBox'

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

  function onSubmitButtonClick(): void {
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

    fetch(
      `${import.meta.env.VITE_API_HOST}/idea-box/container/${innerOpenType}` +
        (innerOpenType === 'update' ? `/${existedData.id}` : ''),
      {
        method: innerOpenType === 'create' ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        },
        body: JSON.stringify(container)
      }
    )
      .then(async res => {
        const data = await res.json()
        if (!res.ok) {
          throw data.message
        }
        toast.success(
          {
            create: 'Yay! Container created. Time to fill it up.',
            update: 'Yay! Container updated.'
          }[innerOpenType!]
        )
        setOpenType(null)
        updateContainerList()
      })
      .catch(err => {
        toast.error(
          {
            create: "Oops! Couldn't create the container. Please try again.",
            update: "Oops! Couldn't update the container. Please try again."
          }[innerOpenType!]
        )
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
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
          onClick={onSubmitButtonClick}
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
