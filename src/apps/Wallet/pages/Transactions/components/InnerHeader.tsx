import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { useTranslation } from 'react-i18next'

import { Button, HeaderFilter, MenuItem } from '@lifeforge/ui'

import { useFilteredTransactions } from '@apps/Wallet/hooks/useFilteredTransactions'
import { useWalletData } from '@apps/Wallet/hooks/useWalletData'
import { useWalletStore } from '@apps/Wallet/stores/useWalletStore'

function InnerHeader({
  setModifyModalOpenType,
  setUploadReceiptModalOpen
}: {
  setModifyModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setUploadReceiptModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { transactionsQuery, assetsQuery, categoriesQuery, ledgersQuery } =
    useWalletData()
  const {
    searchQuery,
    selectedType,
    selectedCategory,
    selectedAsset,
    selectedLedger,
    setSidebarOpen
  } = useWalletStore()
  const { t } = useTranslation(['common.buttons', 'apps.wallet'])
  const assets = assetsQuery.data ?? []
  const categories = categoriesQuery.data ?? []
  const ledgers = ledgersQuery.data ?? []
  const transactions = transactionsQuery.data ?? []
  const filteredTransactions = useFilteredTransactions(
    transactionsQuery.data ?? []
  )

  return (
    <div className="flex-between flex">
      <div>
        <h1 className="text-3xl font-semibold lg:text-4xl">
          {t(
            `apps.wallet:header.${
              !selectedType &&
              !selectedCategory &&
              !selectedAsset &&
              !selectedLedger &&
              searchQuery === ''
                ? 'all'
                : 'filtered'
            }Transactions`
          )}{' '}
          <span className="text-bg-500 text-base">
            ({filteredTransactions.length})
          </span>
        </h1>
        <HeaderFilter
          items={{
            type: {
              data: [
                {
                  id: 'income',
                  icon: 'tabler:login-2',
                  name: 'Income',
                  color: '#22c55e'
                },
                {
                  id: 'expenses',
                  icon: 'tabler:logout',
                  name: 'Expenses',
                  color: '#ef4444'
                },
                {
                  id: 'transfer',
                  icon: 'tabler:transfer',
                  name: 'Transfer',
                  color: '#3b82f6'
                }
              ],
              isColored: true
            },
            category: {
              data: categories,
              isColored: true
            },
            asset: {
              data: assets
            },
            ledger: {
              data: ledgers,
              isColored: true
            }
          }}
        />
      </div>
      <div className="flex items-center gap-6">
        {typeof transactions !== 'string' && transactions.length > 0 && (
          <Menu as="div" className="relative z-50 hidden md:block">
            <Button
              as={MenuButton}
              className="hidden md:flex"
              icon="tabler:plus"
              onClick={() => {}}
            >
              {t('common.buttons:new', {
                item: t('apps.wallet:items.transaction')
              })}
            </Button>
            <MenuItems
              transition
              anchor="bottom end"
              className="bg-bg-100 dark:bg-bg-800 mt-2 min-w-[var(--button-width)] overflow-hidden overscroll-contain rounded-md shadow-lg outline-hidden transition duration-100 ease-out focus:outline-hidden data-closed:scale-95 data-closed:opacity-0"
            >
              <MenuItem
                icon="tabler:plus"
                namespace="apps.wallet"
                text="Add Manually"
                onClick={() => {
                  setModifyModalOpenType('create')
                }}
              />
              <MenuItem
                icon="tabler:scan"
                namespace="apps.wallet"
                text="Scan Receipt"
                onClick={() => {
                  setUploadReceiptModalOpen(true)
                }}
              />
            </MenuItems>
          </Menu>
        )}
        <Button
          className="xl:hidden"
          icon="tabler:menu"
          variant="plain"
          onClick={() => {
            setSidebarOpen(true)
          }}
        />
      </div>
    </div>
  )
}

export default InnerHeader
