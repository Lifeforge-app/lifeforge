/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { useDebounce } from '@uidotdev/usehooks'
import { cookieParse } from 'pocketbase'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ColorInput from '@components/ColorPicker/ColorInput'
import ColorPickerModal from '@components/ColorPicker/ColorPickerModal'
import CreateOrModifyButton from '@components/CreateOrModifyButton'
import IconSelector from '@components/IconSelector'
import IconInput from '@components/IconSelector/IconInput'
import Input from '@components/Input'
import Modal from '@components/Modal'
import ModalHeader from '@components/ModalHeader'
import { useTodoListContext } from '@providers/TodoListProvider'

function ModifyListModal(): React.ReactElement {
  const {
    modifyListModalOpenType: openType,
    setModifyListModalOpenType: setOpenType,
    refreshLists,
    selectedList
  } = useTodoListContext()
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
        (innerOpenType === 'update' ? `/${selectedList?.id}` : ''),
      {
        method: innerOpenType === 'create' ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        },
        body: JSON.stringify(list)
      }
    )
      .then(async res => {
        const data = await res.json()
        if (!res.ok) {
          throw data.message
        }
        toast.success(
          {
            create: 'Yay! List created. Time to start adding tasks.',
            update: 'Yay! List updated.'
          }[innerOpenType!]
        )
        setOpenType(null)
        refreshLists()
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
    if (innerOpenType === 'update' && selectedList !== null) {
      setListName(selectedList.name)
      setListColor(selectedList.color)
      setListIcon(selectedList.icon)
    } else {
      setListName('')
      setListColor('#FFFFFF')
      setListIcon('')
    }
  }, [innerOpenType, selectedList])

  return (
    <>
      <Modal isOpen={openType !== null}>
        <ModalHeader
          title={`${
            {
              create: 'Create ',
              update: 'Update '
            }[innerOpenType!]
          }list`}
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
