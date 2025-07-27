import { EmptyStateScreen, ModalHeader, QueryWrapper } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'

import ModifyCategoryModal from '../ModifyCategoryModal'
import CategorySection from './components/CategorySection'

function ManageCategoriesModal({ onClose }: { onClose: () => void }) {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.wallet')

  const { categoriesQuery } = useWalletData()

  const handleCreateIncomeCategory = () =>
    open(ModifyCategoryModal, {
      type: 'create'
    })

  return (
    <div className="min-w-[40rem]!">
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
              onCTAClick={handleCreateIncomeCategory}
            />
          )
        }
      </QueryWrapper>
    </div>
  )
}

export default ManageCategoriesModal
