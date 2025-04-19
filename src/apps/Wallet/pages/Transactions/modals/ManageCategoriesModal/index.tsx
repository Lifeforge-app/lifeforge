import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  DeleteConfirmationModal,
  EmptyStateScreen,
  ModalHeader,
  ModalWrapper,
  QueryWrapper
} from '@lifeforge/ui'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'
import { useWalletStore } from '@apps/Wallet/stores/useWalletStore'

import { type IWalletCategory } from '../../../../interfaces/wallet_interfaces'
import ModifyCategoriesModal from '../ModifyCategoriesModal'
import CategorySection from './components/CategorySection'

function ManageCategoriesModal() {
  const { t } = useTranslation('apps.wallet')
  const { isManageCategoriesModalOpen: isOpen, setManageCategoriesModalOpen } =
    useWalletStore()
  const { categoriesQuery } = useWalletData()
  const [modifyCategoriesModalOpenType, setModifyCategoriesModalOpenType] =
    useState<'income' | 'expenses' | 'update' | null>(null)
  const [existedData, setExistedData] = useState<IWalletCategory | null>(null)
  const [
    deleteCategoriesConfirmationOpen,
    setDeleteCategoriesConfirmationOpen
  ] = useState(false)

  useEffect(() => {
    if (isOpen === 'new') {
      setTimeout(() => {
        setModifyCategoriesModalOpenType('income')
      }, 200)
    }
  }, [isOpen])

  const handleDeleteConfirmationModalClose = useCallback(() => {
    setDeleteCategoriesConfirmationOpen(false)
    setExistedData(null)
  }, [])

  const onClose = useCallback(() => {
    setManageCategoriesModalOpen(false)
    setModifyCategoriesModalOpenType(null)
    setExistedData(null)
    setDeleteCategoriesConfirmationOpen(false)
  }, [setManageCategoriesModalOpen])

  return (
    <>
      <ModalWrapper className="sm:min-w-[40rem]!" isOpen={isOpen !== false}>
        <ModalHeader
          icon="tabler:apps"
          namespace="apps.wallet"
          title="categories.manage"
          onClose={onClose}
        />
        <QueryWrapper query={categoriesQuery}>
          {categories =>
            categories.length > 0 ? (
              <>
                {['income', 'expenses'].map(type => (
                  <CategorySection
                    key={type}
                    categories={categories}
                    iconName={
                      type === 'income' ? 'tabler:login-2' : 'tabler:logout'
                    }
                    setDeleteCategoriesConfirmationOpen={
                      setDeleteCategoriesConfirmationOpen
                    }
                    setExistedData={setExistedData}
                    setModifyCategoriesModalOpenType={
                      setModifyCategoriesModalOpenType
                    }
                    type={type as 'income' | 'expenses'}
                  />
                ))}
              </>
            ) : (
              <EmptyStateScreen
                ctaContent="new"
                ctaTProps={{
                  item: t('items.category')
                }}
                icon="tabler:apps-off"
                name="categories"
                namespace="apps.wallet"
                onCTAClick={() => {
                  setModifyCategoriesModalOpenType('income')
                }}
              />
            )
          }
        </QueryWrapper>
      </ModalWrapper>
      <ModifyCategoriesModal
        existedData={existedData}
        openType={modifyCategoriesModalOpenType}
        setOpenType={setModifyCategoriesModalOpenType}
      />
      <DeleteConfirmationModal
        apiEndpoint="wallet/category"
        confirmationText="Delete this category"
        data={existedData ?? undefined}
        isOpen={deleteCategoriesConfirmationOpen}
        itemName="category"
        nameKey="name"
        queryKey={['wallet', 'categories']}
        onClose={handleDeleteConfirmationModalClose}
      />
    </>
  )
}

export default ManageCategoriesModal
