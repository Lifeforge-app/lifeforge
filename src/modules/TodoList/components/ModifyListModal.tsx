/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable multiline-ternary */
import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { toast } from 'react-toastify'
import { useDebounce } from '@uidotdev/usehooks'
import Modal from '../../../components/general/Modal'
import ColorPickerModal from '../../../components/general/ColorPicker/ColorPickerModal'
import { type ITodoListList } from './Sidebar'
import CreateOrModifyButton from '../../../components/general/CreateOrModifyButton'
import IconSelector from '../../../components/general/IconSelector'
import Input from '../../../components/general/Input'
import IconInput from '../../../components/general/IconSelector/IconInput'
import ColorInput from '../../../components/general/ColorPicker/ColorInput'

function ModifyListModal({
  openType,
  setOpenType,
  updateListsList,
  existedData
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  updateListsList: () => void
  existedData: ITodoListList | null
}): React.ReactElement {
  const [loading, setLoading] = useState(false)
  const [listName, setListName] = useState('')
  const [listIcon, setListIcon] = useState('')
  const [listColor, setListColor] = useState('#FFFFFF')
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false)
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const innerOpenType = useDebounce(openType, openType === null ? 300 : 0)

  function updateListName(e: React.ChangeEvent<HTMLInputElement>): void {
    setListName(e.target.value)
  }

  function updateListColor(e: React.ChangeEvent<HTMLInputElement>): void {
    setListColor(e.target.value)
  }

  function onSubmitButtonClick(): void {
    if (
      listName.trim().length === 0 ||
      listIcon.trim().length === 0 ||
      listColor.trim().length === 0
    ) {
      toast.error('Please fill in all the fields.')
      return
    }

    setLoading(true)

    const list = {
      name: listName.trim(),
      icon: listIcon.trim(),
      color: listColor.trim()
    }

    fetch(
      `${import.meta.env.VITE_API_HOST}/todo-list/list/${innerOpenType}` +
        (innerOpenType === 'update' ? `/${existedData?.id}` : ''),
      {
        method: innerOpenType === 'create' ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(list)
      }
    )
      .then(async res => {
        const data = await res.json()
        if (res.status !== 200) {
          throw data.message
        }
        toast.success(
          {
            create: 'Yay! List created. Time to fill it up.',
            update: 'Yay! List updated.'
          }[innerOpenType!]
        )
        setOpenType(null)
        updateListsList()
      })
      .catch(err => {
        toast.error(
          {
            create: "Oops! Couldn't create the list. Please try again.",
            update: "Oops! Couldn't update the list. Please try again."
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
      setListName(existedData.name)
      setListColor(existedData.color)
      setListIcon(existedData.icon)
    } else {
      setListName('')
      setListColor('#FFFFFF')
      setListIcon('')
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
            list
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
          name="List name"
          value={listName}
          updateValue={updateListName}
          placeholder="List name"
          icon="tabler:list"
          darker
        />
        <IconInput
          name="List icon"
          icon={listIcon}
          setIcon={setListIcon}
          setIconSelectorOpen={setIconSelectorOpen}
        />
        <ColorInput
          name="List color"
          color={listColor}
          updateColor={updateListColor}
          setColorPickerOpen={setColorPickerOpen}
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
        setSelectedIcon={setListIcon}
      />
      <ColorPickerModal
        isOpen={colorPickerOpen}
        setOpen={setColorPickerOpen}
        color={listColor}
        setColor={setListColor}
      />
    </>
  )
}

export default ModifyListModal
