import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { CreateOrModifyButton } from '@components/buttons'
import {
  ColorInput,
  ColorPickerModal,
  IconInput,
  IconPickerModal,
  TextInput
} from '@components/inputs'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import { type IWalletCategory } from '@interfaces/wallet_interfaces'
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
  existedData: IWalletCategory | null
  setExistedData: React.Dispatch<React.SetStateAction<IWalletCategory | null>>
}): React.ReactElement {
  const { t } = useTranslation('modules.wallet')
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

  async function onSubmitButtonClick(): Promise<void> {
    if (
      categoryName.trim().length === 0 ||
      !categoryColor ||
      categoryIcon.trim().length === 0
    ) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    setIsLoading(true)
    await APIRequest({
      endpoint: `wallet/categories${
        openType === 'update' ? `/${existedData?.id}` : ''
      }`,
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
      <ModalWrapper className="sm:min-w-[30rem]" isOpen={openType !== null}>
        <ModalHeader
          icon={openType === 'update' ? 'tabler:pencil' : 'tabler:plus'}
          namespace="modules.wallet"
          title={`categories.${openType === 'update' ? 'update' : 'create'}`}
          onClose={() => {
            setOpenType(null)
          }}
        />
        <div
          className={`flex-between flex gap-4 ${
            openType === 'update' ? 'mb-4' : 'mb-2'
          }`}
        >
          <span className="flex items-center gap-2 font-medium text-bg-500">
            <Icon className="size-6" icon="tabler:apps" />
            {t('inputs.categoryType')}
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
                className="size-5"
                icon={
                  categoryType === 'expenses'
                    ? 'tabler:logout'
                    : 'tabler:login-2'
                }
              />
              <span>{t(`transactionTypes.${categoryType}`)}</span>
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
                  activeBgColor={bgColor}
                  categoryType={categoryType}
                  iconName={icon}
                  label={label}
                  setCategoryType={setCategoryType}
                />
              ))}
            </div>
          </>
        )}

        <TextInput
          darker
          icon="tabler:pencil"
          name="Category name"
          namespace="modules.wallet"
          placeholder="My Categories"
          updateValue={setCategoryName}
          value={categoryName}
        />
        <IconInput
          icon={categoryIcon}
          name="Category icon"
          namespace="modules.wallet"
          setIcon={setCategoryIcon}
          setIconSelectorOpen={setIconSelectorOpen}
        />
        <ColorInput
          color={categoryColor}
          name="Category color"
          namespace="modules.wallet"
          setColorPickerOpen={setColorPickerOpen}
          updateColor={setCategoryColor}
        />
        <CreateOrModifyButton
          loading={isLoading}
          type={openType === 'update' ? 'update' : 'create'}
          onClick={() => {
            onSubmitButtonClick().catch(console.error)
          }}
        />
      </ModalWrapper>
      <IconPickerModal
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
