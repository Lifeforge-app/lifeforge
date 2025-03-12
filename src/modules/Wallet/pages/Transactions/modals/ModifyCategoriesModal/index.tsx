import { Icon } from '@iconify/react'
import fetchAPI from '@utils/fetchAPI'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import {
  ColorInput,
  ColorPickerModal,
  CreateOrModifyButton,
  IconInput,
  IconPickerModal,
  ModalHeader,
  ModalWrapper,
  TextInput
} from '@lifeforge/ui'

import { useWalletContext } from '@modules/Wallet/providers/WalletProvider'

import { type IWalletCategory } from '../../../../interfaces/wallet_interfaces'
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

    try {
      await fetchAPI(
        `wallet/categories${
          openType === 'update' ? `/${existedData?.id}` : ''
        }`,
        {
          method: openType !== 'update' ? 'POST' : 'PATCH',
          body: {
            type: categoryType,
            name: categoryName,
            icon: categoryIcon,
            color: categoryColor
          }
        }
      )

      refreshCategories()
      setExistedData(null)
      setOpenType(null)
    } catch {
      toast.error(t('input.error.somethingWentWrong'))
    } finally {
      setIsLoading(false)
    }
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
          className={clsx(
            'flex-between flex gap-4',
            openType === 'update' ? 'mb-4' : 'mb-2'
          )}
        >
          <span className="text-bg-500 flex items-center gap-2 font-medium">
            <Icon className="size-6" icon="tabler:apps" />
            {t('inputs.categoryType')}
          </span>
          {openType === 'update' && (
            <div
              className={clsx(
                'flex items-center gap-2 rounded-md p-2',
                {
                  income: 'bg-green-500/20 text-green-500',
                  expenses: 'bg-red-500/20 text-red-500'
                }[categoryType]
              )}
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
          setValue={setCategoryName}
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
          setColor={setCategoryColor}
          setColorPickerOpen={setColorPickerOpen}
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
