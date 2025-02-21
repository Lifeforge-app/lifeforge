import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { Button } from '@components/buttons'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import HeaderFilter from '@components/utilities/HeaderFilter'
import { useWalletContext } from '@providers/WalletProvider'

function Header({
  setModifyModalOpenType,
  setUploadReceiptModalOpen,
  setSidebarOpen
}: {
  setModifyModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setUploadReceiptModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  const {
    categories,
    assets,
    ledgers,
    transactions,
    searchQuery,
    filteredTransactions
  } = useWalletContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const { t } = useTranslation(['common.buttons', 'modules.wallet'])

  useEffect(() => {
    const params = searchParams.get('type')
    if (params === null) return
    if (!['income', 'expenses', 'transfer'].includes(params)) {
      searchParams.delete('type')
      setSearchParams(searchParams)
    }
  }, [searchParams])

  useEffect(() => {
    const params = searchParams.get('category')
    if (params === null || typeof categories === 'string') return
    if (
      categories.find(category => category.id === params) === undefined &&
      params !== 'all'
    ) {
      searchParams.delete('category')
      setSearchParams(searchParams)
    }
  }, [searchParams, categories])

  useEffect(() => {
    const params = searchParams.get('asset')
    if (params === null || typeof assets === 'string') return
    if (
      assets.find(asset => asset.id === params) === undefined &&
      params !== 'all'
    ) {
      searchParams.delete('asset')

      setSearchParams(searchParams)
    }
  }, [searchParams, assets])

  useEffect(() => {
    const params = searchParams.get('ledger')
    if (params === null || typeof ledgers === 'string') return
    if (
      ledgers.find(ledger => ledger.id === params) === undefined &&
      params !== 'all'
    ) {
      searchParams.delete('ledger')
      setSearchParams(searchParams)
    }
  }, [searchParams, ledgers])

  return (
    <div className="flex-between flex">
      <div>
        <h1 className="text-3xl font-semibold lg:text-4xl">
          {t(
            `modules.wallet:header.${
              searchParams.size === 0 && searchQuery === '' ? 'all' : 'filtered'
            }Transactions`
          )}{' '}
          <span className="text-base text-bg-500">
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
                item: t('modules.wallet:items.transaction')
              })}
            </Button>
            <MenuItems
              transition
              anchor="bottom end"
              className="mt-2 min-w-[var(--button-width)] overflow-hidden overscroll-contain rounded-md bg-bg-100 shadow-lg outline-hidden transition duration-100 ease-out focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 dark:bg-bg-800"
            >
              <MenuItem
                icon="tabler:plus"
                namespace="modules.wallet"
                text="Add Manually"
                onClick={() => {
                  setModifyModalOpenType('create')
                }}
              />
              <MenuItem
                icon="tabler:scan"
                namespace="modules.wallet"
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
          variant="no-bg"
          onClick={() => {
            setSidebarOpen(true)
          }}
        />
      </div>
    </div>
  )
}

export default Header
