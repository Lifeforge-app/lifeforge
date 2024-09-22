/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { useDebounce } from '@uidotdev/usehooks'
import { t } from 'i18next'
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
import { useTodoListContext } from '@providers/TodoListProvider'
import APIRequest from '@utils/fetchData'

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

  async function onSubmitButtonClick(): Promise<void> {
    if (
      listName.trim().length === 0 ||
      listIcon.trim().length === 0 ||
      listColor.trim().length === 0
    ) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    setLoading(true)

    const list = {
      name: listName.trim(),
      icon: listIcon.trim(),
      color: listColor.trim()
    }

    await APIRequest({
      endpoint:
        'todo-list/lists' +
        (innerOpenType === 'update' ? `/${selectedList?.id}` : ''),
      method: innerOpenType === 'create' ? 'POST' : 'PATCH',
      body: list,
      successInfo: innerOpenType,
      failureInfo: innerOpenType,
      finalCallback: () => {
        setLoading(false)
      },
      callback: () => {
        setOpenType(null)
        refreshLists()
      }
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
          onClick={() => {
            onSubmitButtonClick().catch(console.error)
          }}
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
