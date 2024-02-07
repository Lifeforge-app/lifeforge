/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable multiline-ternary */
import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { toast } from 'react-toastify'
import { useDebounce } from '@uidotdev/usehooks'
import Modal from '../../../components/general/Modal'
import ColorPickerModal from '../../../components/general/ColorPicker/ColorPickerModal'
import { type ICodeSnippetsLabel } from './Sidebar/components/Labels'
import CreateOrModifyButton from '../../../components/general/CreateOrModifyButton'
import Input from '../../../components/general/Input'
import ColorInput from '../../../components/general/ColorPicker/ColorInput'

function ModifyLabelModal({
  openType,
  setOpenType,
  updateLabelList,
  existedData
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  updateLabelList: () => void
  existedData: ICodeSnippetsLabel | null
}): React.ReactElement {
  const [loading, setLoading] = useState(false)
  const [labelName, setLabelName] = useState('')
  const [labelColor, setLabelColor] = useState('#FFFFFF')
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const innerOpenType = useDebounce(openType, openType === null ? 300 : 0)

  function updateLabelName(e: React.ChangeEvent<HTMLInputElement>): void {
    setLabelName(e.target.value)
  }

  function updateLabelColor(e: React.ChangeEvent<HTMLInputElement>): void {
    setLabelColor(e.target.value)
  }

  function onSubmitButtonClick(): void {
    if (labelName.trim().length === 0 || labelColor.trim().length === 0) {
      toast.error('Please fill in all the fields.')
      return
    }

    setLoading(true)

    const label = {
      name: labelName.trim(),
      color: labelColor.trim()
    }

    fetch(
      `${import.meta.env.VITE_API_HOST}/code-snippets/label/${innerOpenType}` +
        (innerOpenType === 'update' ? `/${existedData!.id}` : ''),
      {
        method: innerOpenType === 'create' ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(label)
      }
    )
      .then(async res => {
        const data = await res.json()
        if (res.status !== 200) {
          throw data.message
        }
        toast.success(
          {
            create: 'Yay! Label created. Time to fill it up.',
            update: 'Yay! Label updated.'
          }[innerOpenType!]
        )
        setOpenType(null)
        updateLabelList()
      })
      .catch(err => {
        toast.error(
          {
            create: "Oops! Couldn't create the label. Please try again.",
            update: "Oops! Couldn't update the label. Please try again."
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
      setLabelName(existedData.name)
      setLabelColor(existedData.color)
    } else {
      setLabelName('')
      setLabelColor('#FFFFFF')
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
            label
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
          icon="tabler:tag"
          name="Label name"
          placeholder="My label"
          value={labelName}
          updateValue={updateLabelName}
          darker
        />
        <ColorInput
          name="Label color"
          color={labelColor}
          updateColor={updateLabelColor}
          setColorPickerOpen={setColorPickerOpen}
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
        color={labelColor}
        setColor={setLabelColor}
      />
    </>
  )
}

export default ModifyLabelModal
