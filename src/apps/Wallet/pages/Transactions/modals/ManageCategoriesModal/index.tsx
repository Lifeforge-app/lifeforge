import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  APIFallbackComponent,
  DeleteConfirmationModal,
  EmptyStateScreen,
  ModalHeader,
  ModalWrapper
} from '@lifeforge/ui'

import { useWalletContext } from '@apps/Wallet/providers/WalletProvider'

import { type IWalletCategory } from '../../../../interfaces/wallet_interfaces'
import ModifyCategoriesModal from '../ModifyCategoriesModal'
import CategorySection from './components/CategorySection'

function ManageCategoriesModal({
  isOpen,
  onClose
}: {
  isOpen: boolean | 'new'
  onClose: () => void
}) {
  const { t } = useTranslation('apps.wallet')
  const { categories } = useWalletContext()
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
      <ModalWrapper className="sm:min-w-[40rem]!" isOpen={isOpen !== false}>
        <ModalHeader
          icon="tabler:apps"
          namespace="apps.wallet"
          title="categories.manage"
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
        </APIFallbackComponent>
      </ModalWrapper>
      <ModifyCategoriesModal
        existedData={existedData}
        openType={modifyCategoriesModalOpenType}
        setOpenType={setModifyCategoriesModalOpenType}
      />
      <DeleteConfirmationModal
        apiEndpoint="wallet/category"
        data={existedData ?? undefined}
        isOpen={deleteCategoriesConfirmationOpen}
        itemName="category"
        nameKey="name"
        queryKey={['wallet', 'categories']}
        onClose={() => {
          setDeleteCategoriesConfirmationOpen(false)
        }}
      />
    </>
  )
}

export default ManageCategoriesModal
