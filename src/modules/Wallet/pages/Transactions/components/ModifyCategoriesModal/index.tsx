/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ColorInput from '@components/ButtonsAndInputs/ColorPicker/ColorInput'
import ColorPickerModal from '@components/ButtonsAndInputs/ColorPicker/ColorPickerModal'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import IconSelector from '@components/ButtonsAndInputs/IconSelector'
import IconInput from '@components/ButtonsAndInputs/IconSelector/IconInput'
import Input from '@components/ButtonsAndInputs/Input'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import { type IWalletCategoryEntry } from '@interfaces/wallet_interfaces'
import { useWalletContext } from '@providers/WalletProvider'
import APIRequest from '@utils/fetchData'
import CategoryToggleButton from './components/CategoryToggleButton'

function ModifyCategoriesModal({
  openType,
  setOpenType,
  existedData,
  setExistedData
}: {
  openType: 'income' | 'expenses' | 'update' | null
  setOpenType: React.Dispatch<
    React.SetStateAction<'income' | 'expenses' | 'update' | null>
  >
  existedData: IWalletCategoryEntry | null
  setExistedData: React.Dispatch<
    React.SetStateAction<IWalletCategoryEntry | null>
  >
}): React.ReactElement {
  const { refreshCategories } = useWalletContext()
  const [categoryType, setCategoryType] = useState<'income' | 'expenses'>(
    'income'
  )
  const [categoryName, setCategoryName] = useState('')
  const [categoryIcon, setCategoryIcon] = useState('')
  const [categoryColor, setCategoryColor] = useState<string>('#FFFFFF')
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false)
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (openType) {
      if (openType === 'update') {
        if (existedData) {
          setCategoryType(existedData.type)
          setCategoryName(existedData.name)
          setCategoryIcon(existedData.icon)
          setCategoryColor(existedData.color)
        }
      } else {
        setCategoryType(openType)
        setCategoryName('')
        setCategoryIcon('')
        setCategoryColor('#FFFFFF')
      }
    }
  }, [openType, existedData])

  function updateCategoryName(e: React.ChangeEvent<HTMLInputElement>): void {
    setCategoryName(e.target.value)
  }

  function updateCategoryColor(e: React.ChangeEvent<HTMLInputElement>): void {
    setCategoryColor(e.target.value)
  }

  async function onSubmitButtonClick(): Promise<void> {
    if (
      categoryName.trim().length === 0 ||
      !categoryColor ||
      categoryIcon.trim().length === 0
    ) {
      toast.error('Please fill in all the fields.')
      return
    }

    setIsLoading(true)
    await APIRequest({
      endpoint: `wallet/category/${
        openType === 'update' ? 'update' : 'create'
      }${openType === 'update' ? `/${existedData?.id}` : ''}`,
      method: openType !== 'update' ? 'POST' : 'PATCH',
      body: {
        type: categoryType,
        name: categoryName,
        icon: categoryIcon,
        color: categoryColor
      },
      successInfo: openType === 'update' ? 'update' : 'create',
      failureInfo: openType === 'update' ? 'update' : 'create',
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
      {' '}
      <Modal isOpen={openType !== null} minWidth="30rem">
        <ModalHeader
          icon={openType === 'update' ? 'tabler:pencil' : 'tabler:plus'}
          title={openType === 'update' ? 'Edit Category' : 'Add Category'}
          onClose={() => {
            setOpenType(null)
          }}
        />
        <div
          className={`flex items-center justify-between gap-4 ${
            openType === 'update' ? 'mb-4' : 'mb-2'
          }`}
        >
          <span className="flex items-center gap-2 font-medium text-bg-500">
            <Icon icon="tabler:apps" className="size-6" />
            Category type
          </span>
          {openType === 'update' && (
            <div
              className={`flex items-center gap-2 ${
                {
                  income: 'bg-green-500/20 text-green-500',
                  expenses: 'bg-red-500/20 text-red-500'
                }[categoryType]
              }
              rounded-md p-2`}
            >
              <Icon
                icon={
                  categoryType === 'expenses'
                    ? 'tabler:logout'
                    : 'tabler:login-2'
                }
                className="size-5"
              />
              <span>
                {categoryType[0].toUpperCase() + categoryType.slice(1)}
              </span>
            </div>
          )}
        </div>
        {openType !== 'update' && (
          <>
            <div className="mb-4 flex items-center gap-2">
              {(
                [
                  ['Income', 'bg-green-500', 'tabler:login-2'],
                  ['Expenses', 'bg-red-500', 'tabler:logout']
                ] as Array<[string, string, string]>
              ).map(([label, bgColor, icon]) => (
                <CategoryToggleButton
                  key={label}
                  categoryType={categoryType}
                  setCategoryType={setCategoryType}
                  iconName={icon}
                  label={label}
                  activeBgColor={bgColor}
                />
              ))}
            </div>
          </>
        )}

        <Input
          icon="tabler:pencil"
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
        <ColorInput
          color={categoryColor}
          name="Category color"
          setColorPickerOpen={setColorPickerOpen}
          updateColor={updateCategoryColor}
        />
        <CreateOrModifyButton
          loading={isLoading}
          onClick={() => {
            onSubmitButtonClick().catch(console.error)
          }}
          type={openType === 'update' ? 'update' : 'create'}
        />
      </Modal>
      <IconSelector
        isOpen={iconSelectorOpen}
        setOpen={setIconSelectorOpen}
        setSelectedIcon={setCategoryIcon}
      />
      <ColorPickerModal
        color={categoryColor}
        isOpen={colorPickerOpen}
        setColor={setCategoryColor}
        setOpen={setColorPickerOpen}
      />
    </>
  )
}

export default ModifyCategoriesModal
