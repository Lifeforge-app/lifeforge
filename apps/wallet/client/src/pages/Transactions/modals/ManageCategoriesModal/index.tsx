import { useWalletData } from '@/hooks/useWalletData'
import {
  EmptyStateScreen,
  ModalHeader,
  Scrollbar,
  Tabs,
  WithQuery
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AutoSizer } from 'react-virtualized'

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
    <div className="flex min-h-[80vh] min-w-[40vw] flex-col">
      <ModalHeader
        actionButtonProps={{
          icon: 'tabler:plus',
          onClick: () => {
            open(ModifyCategoryModal, {
              type: 'create'
            })
          }
        }}
        icon="tabler:apps"
        namespace="apps.wallet"
        title="categories.manage"
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
        onNavClick={setSelectedTab as (value: string) => void}
      />
      <WithQuery query={categoriesQuery}>
        {categories =>
          categories.length > 0 ? (
            <div className="mt-4 flex-1">
              <AutoSizer>
                {({ width, height }) => (
                  <Scrollbar
                    style={{
                      width,
                      height
                    }}
                  >
                    <ul className="space-y-3">
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
                  </Scrollbar>
                )}
              </AutoSizer>
            </div>
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
      </WithQuery>
    </div>
  )
}

export default ManageCategoriesModal
