/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable multiline-ternary */
import React, { useEffect, useState } from 'react'
import Modal from '../../../../../components/general/Modal'
import { Icon } from '@iconify/react/dist/iconify.js'
import ColorPickerModal from '../../../../../components/general/ColorPicker/ColorPickerModal'
import { toast } from 'react-toastify'
import { type IIdeaBoxContainer } from '../../..'
import { useDebounce } from '@uidotdev/usehooks'
import IconInput from '../../../../../components/general/IconSelector/IconInput'
import Input from '../../../../../components/general/Input'
import IconSelector from '../../../../../components/general/IconSelector'
import CreateOrModifyButton from '../../../../../components/general/CreateOrModifyButton'
import ColorInput from '../../../../../components/general/ColorPicker/ColorInput'
import { cookieParse } from 'pocketbase'

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
        (innerOpenType === 'update' ? `/${existedData!.id}` : ''),
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
        if (res.status !== 200) {
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
            container
          </h1>
          <button
            onClick={() => {
              setOpenType(null)
            }}
            className="rounded-md p-2 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:text-bg-100 dark:hover:bg-bg-800"
          >
            <Icon icon="tabler:x" className="h-6 w-6" />
          </button>
        </div>
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
