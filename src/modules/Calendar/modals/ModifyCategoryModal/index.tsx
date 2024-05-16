/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable multiline-ternary */
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
import { type ICalendarCategory } from '@typedec/Calendar'

function ModifyCategoryModal({
  openType,
  setOpenType,
  existedData,
  refreshCategories
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  existedData: ICalendarCategory | null
  refreshCategories: () => void
}): React.ReactElement {
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

  function onSubmitButtonClick(): void {
    if (
      categoryName.trim().length === 0 ||
      categoryIcon.trim().length === 0 ||
      categoryColor.trim().length === 0
    ) {
      toast.error('Please fill in all the fields.')
      return
    }

    setLoading(true)

    const category = {
      name: categoryName.trim(),
      icon: categoryIcon.trim(),
      color: categoryColor.trim()
    }

    fetch(
      `${import.meta.env.VITE_API_HOST}/calendar/category/${innerOpenType}` +
        (innerOpenType === 'update' ? `/${existedData?.id}` : ''),
      {
        method: innerOpenType === 'create' ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        },
        body: JSON.stringify(category)
      }
    )
      .then(async res => {
        const data = await res.json()
        if (!res.ok) {
          throw data.message
        }
        toast.success(
          {
            create: 'Yay! Category created. Time to start adding tasks.',
            update: 'Yay! Category updated.'
          }[innerOpenType!]
        )
        setOpenType(null)
        refreshCategories()
      })
      .catch(err => {
        toast.error(
          {
            create: "Oops! Couldn't create the category. Please try again.",
            update: "Oops! Couldn't update the category. Please try again."
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
          onClick={onSubmitButtonClick}
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
