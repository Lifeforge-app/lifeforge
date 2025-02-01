import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import { type IWalletCategory } from '@interfaces/wallet_interfaces'
import { useWalletContext } from '@providers/WalletProvider'
import CategorySection from './components/CategorySection'
import ModifyCategoriesModal from '../ModifyCategoriesModal'

function ManageCategoriesModal({
  isOpen,
  onClose
}: {
  isOpen: boolean | 'new'
  onClose: () => void
}): React.ReactElement {
  const { t } = useTranslation('modules.wallet')
  const { categories, refreshCategories } = useWalletContext()
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

  return (
    <>
      <ModalWrapper isOpen={isOpen !== false} className="sm:min-w-[40rem]!">
        <ModalHeader
          title="categories.manage"
          namespace="modules.wallet"
          icon="tabler:apps"
          onClose={onClose}
        />
        <APIFallbackComponent data={categories}>
          {categories =>
            categories.length > 0 ? (
              <>
                {['income', 'expenses'].map(type => (
                  <CategorySection
                    key={type}
                    categories={categories}
                    type={type as 'income' | 'expenses'}
                    iconName={
                      type === 'income' ? 'tabler:login-2' : 'tabler:logout'
                    }
                    setModifyCategoriesModalOpenType={
                      setModifyCategoriesModalOpenType
                    }
                    setExistedData={setExistedData}
                    setDeleteCategoriesConfirmationOpen={
                      setDeleteCategoriesConfirmationOpen
                    }
                  />
                ))}
              </>
            ) : (
              <EmptyStateScreen
                icon="tabler:apps-off"
                namespace="modules.wallet"
                name="categories"
                ctaContent="new"
                ctaTProps={{
                  item: t('items.category')
                }}
                onCTAClick={() => {
                  setModifyCategoriesModalOpenType('income')
                }}
              />
            )
          }
        </APIFallbackComponent>
      </ModalWrapper>
      <ModifyCategoriesModal
        existedData={existedData}
        setExistedData={setExistedData}
        openType={modifyCategoriesModalOpenType}
        setOpenType={setModifyCategoriesModalOpenType}
      />
      <DeleteConfirmationModal
        isOpen={deleteCategoriesConfirmationOpen}
        onClose={() => {
          setDeleteCategoriesConfirmationOpen(false)
        }}
        apiEndpoint="wallet/category"
        data={existedData}
        updateDataLists={refreshCategories}
        nameKey="name"
        itemName="category"
      />
    </>
  )
}

export default ManageCategoriesModal
