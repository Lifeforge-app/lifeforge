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
import { type ICalendarCategory } from '@interfaces/calendar_interfaces'
import APIRequest from '@utils/fetchData'

interface ModifyCategoryModalProps {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  existedData: ICalendarCategory | null
  refreshCategories: () => void
}

function ModifyCategoryModal({
  openType,
  setOpenType,
  existedData,
  refreshCategories
}: ModifyCategoryModalProps): React.ReactElement {
  const [loading, setLoading] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const [categoryIcon, setCategoryIcon] = useState('')
  const [categoryColor, setCategoryColor] = useState('#FFFFFF')
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false)
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const innerOpenType = useDebounce(openType, openType === null ? 300 : 0)

  function updateCategoryName(e: React.ChangeEvent<HTMLInputElement>): void {
    setCategoryName(e.target.value)
  }

  function updateCategoryColor(e: React.ChangeEvent<HTMLInputElement>): void {
    setCategoryColor(e.target.value)
  }

  async function onSubmitButtonClick(): Promise<void> {
    if (
      categoryName.trim().length === 0 ||
      categoryIcon.trim().length === 0 ||
      categoryColor.trim().length === 0
    ) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    setLoading(true)

    const category = {
      name: categoryName.trim(),
      icon: categoryIcon.trim(),
      color: categoryColor.trim()
    }

    await APIRequest({
      endpoint:
        'calendar/category' +
        (innerOpenType === 'update' ? `/${existedData?.id}` : ''),
      method: innerOpenType === 'create' ? 'POST' : 'PATCH',
      body: category,
      successInfo: innerOpenType,
      failureInfo: innerOpenType,
      finalCallback: () => {
        setLoading(false)
      },
      callback: () => {
        setOpenType(null)
        refreshCategories()
      }
    })
  }

  useEffect(() => {
    if (innerOpenType === 'update' && existedData !== null) {
      setCategoryName(existedData.name)
      setCategoryColor(existedData.color)
      setCategoryIcon(existedData.icon)
    } else {
      setCategoryName('')
      setCategoryColor('#FFFFFF')
      setCategoryIcon('')
    }
  }, [innerOpenType, existedData])

  return (
    <>
      <Modal isOpen={openType !== null}>
        <ModalHeader
          title={`${
            {
              create: 'Create ',
              update: 'Update '
            }[innerOpenType!]
          }category`}
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
          name="Category name"
          value={categoryName}
          updateValue={updateCategoryName}
          placeholder="Category name"
          icon="tabler:category"
          darker
        />
        <IconInput
          name="Category icon"
          icon={categoryIcon}
          setIcon={setCategoryIcon}
          setIconSelectorOpen={setIconSelectorOpen}
        />
        <ColorInput
          name="Category color"
          color={categoryColor}
          updateColor={updateCategoryColor}
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
        setSelectedIcon={setCategoryIcon}
      />
      <ColorPickerModal
        isOpen={colorPickerOpen}
        setOpen={setColorPickerOpen}
        color={categoryColor}
        setColor={setCategoryColor}
      />
    </>
  )
}

export default ModifyCategoryModal
