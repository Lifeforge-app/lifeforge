import { EmptyStateScreen, ModalHeader, QueryWrapper, Tabs } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'

import ModifyCategoryModal from '../ModifyCategoryModal'
import CategoryItem from './components/CategoryItem'

function ManageCategoriesModal({ onClose }: { onClose: () => void }) {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.wallet')

  const { categoriesQuery } = useWalletData()

  const [selectedTab, setSelectedTab] = useState<'income' | 'expenses'>(
    'income'
  )

  const filteredCategories =
    categoriesQuery.data?.filter(category => category.type === selectedTab) ??
    []

  return (
    <div className="min-w-[40vw]">
      <ModalHeader
        actionButtonIcon="tabler:plus"
        icon="tabler:apps"
        namespace="apps.wallet"
        title="categories.manage"
        onActionButtonClick={() => {
          open(ModifyCategoryModal, {
            type: 'create'
          })
        }}
        onClose={onClose}
      />
      <Tabs
        active={selectedTab}
        enabled={['income', 'expenses']}
        items={[
          {
            name: t('transactionTypes.income'),
            id: 'income',
            icon: 'tabler:login-2',
            amount:
              categoriesQuery.data?.filter(
                category => category.type === 'income'
              ).length || 0
          },
          {
            name: t('transactionTypes.expenses'),
            id: 'expenses',
            icon: 'tabler:logout',
            amount:
              categoriesQuery.data?.filter(
                category => category.type === 'expenses'
              ).length || 0
          }
        ]}
        onNavClick={setSelectedTab}
      />
      <QueryWrapper query={categoriesQuery}>
        {categories =>
          categories.length > 0 ? (
            <ul className="mt-4 mb-4 space-y-3">
              {filteredCategories.length > 0 ? (
                filteredCategories.map(category => (
                  <CategoryItem key={category.id} category={category} />
                ))
              ) : (
                <p className="text-bg-500 text-center">
                  No {selectedTab} categories found
                </p>
              )}
            </ul>
          ) : (
            <EmptyStateScreen
              CTAButtonProps={{
                children: 'new',
                icon: 'tabler:plus',
                onClick: () => {
                  open(ModifyCategoryModal, {
                    type: 'create'
                  })
                },
                tProps: { item: t('items.category') }
              }}
              icon="tabler:apps-off"
              name="categories"
              namespace="apps.wallet"
            />
          )
        }
      </QueryWrapper>
    </div>
  )
}

export default ManageCategoriesModal
