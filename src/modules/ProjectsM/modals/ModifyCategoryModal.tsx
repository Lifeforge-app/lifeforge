/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import IconSelector from '@components/ButtonsAndInputs/IconSelector'
import IconInput from '@components/ButtonsAndInputs/IconSelector/IconInput'
import Input from '@components/ButtonsAndInputs/Input'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import { type IProjectsMCategory } from '@interfaces/projects_m_interfaces'
import APIRequest from '@utils/fetchData'

function ModifyCategoriesModal({
  openType,
  setOpenType,
  existedData,
  setExistedData,
  refreshCategories
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  existedData: IProjectsMCategory | null
  setExistedData: React.Dispatch<
    React.SetStateAction<IProjectsMCategory | null>
  >
  refreshCategories: () => void
}): React.ReactElement {
  const [categoryName, setCategoryName] = useState('')
  const [categoryIcon, setCategoryIcon] = useState('')
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (openType) {
      if (openType === 'update') {
        if (existedData) {
          setCategoryName(existedData.name)
          setCategoryIcon(existedData.icon)
        }
      } else {
        setCategoryName('')
        setCategoryIcon('')
      }
    }
  }, [openType, existedData])

  function updateCategoryName(e: React.ChangeEvent<HTMLInputElement>): void {
    setCategoryName(e.target.value)
  }

  async function onSubmitButtonClick(): Promise<void> {
    if (categoryName.trim().length === 0 || categoryIcon.trim().length === 0) {
      toast.error('Please fill in all the fields.')
      return
    }

    setIsLoading(true)
    await APIRequest({
      endpoint: `projects-m/category${
        openType === 'update' ? `/${existedData?.id}` : ''
      }`,
      method: openType === 'create' ? 'POST' : 'PATCH',
      body: {
        name: categoryName,
        icon: categoryIcon
      },
      successInfo: openType,
      failureInfo: openType,
      callback: () => {
        refreshCategories()
        setExistedData(null)
        setOpenType(null)
      },
      finalCallback: () => {
        setIsLoading(false)
      }
    })
  }

  return (
    <>
      <Modal isOpen={openType !== null} className="sm:min-w-[30rem]">
        <ModalHeader
          icon={openType === 'update' ? 'tabler:pencil' : 'tabler:plus'}
          title={openType === 'update' ? 'Edit Category' : 'Add Category'}
          onClose={() => {
            setOpenType(null)
          }}
        />
        <Input
          icon="tabler:book"
          placeholder="My Categories"
          value={categoryName}
          darker
          name="Category name"
          updateValue={updateCategoryName}
        />
        <IconInput
          icon={categoryIcon}
          setIcon={setCategoryIcon}
          name="Category icon"
          setIconSelectorOpen={setIconSelectorOpen}
        />
        <CreateOrModifyButton
          loading={isLoading}
          onClick={() => {
            onSubmitButtonClick().catch(console.error)
          }}
          type={openType}
        />
      </Modal>
      <IconSelector
        isOpen={iconSelectorOpen}
        setOpen={setIconSelectorOpen}
        setSelectedIcon={setCategoryIcon}
      />
    </>
  )
}

export default ModifyCategoriesModal
