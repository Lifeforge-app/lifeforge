import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import colors from 'tailwindcss/colors'
import { SidebarItem, SidebarTitle } from '@components/layouts/sidebar'
import useThemeColors from '@hooks/useThemeColor'
import { useWalletContext } from '@providers/WalletProvider'
import { toCamelCase } from '@utils/strings'

function TypeSection({
  setSidebarOpen
}: {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams()
  const { t } = useTranslation('modules.wallet')
  const { filteredTransactions } = useWalletContext()
  const { bgTemp } = useThemeColors()

  return (
    <>
      <SidebarTitle name={t('sidebar.transactionTypes')} />
      {[
        ['tabler:arrow-bar-both', 'All Types'],
        ['tabler:login-2', 'Income'],
        ['tabler:logout', 'Expenses'],
        ['tabler:transfer', 'Transfer']
      ].map(([icon, name]) => (
        <SidebarItem
          key={name}
          active={
            searchParams.get('type') === name.toLowerCase() ||
            (searchParams.get('type') === null && name === 'All Types')
          }
          icon={icon}
          name={t(
            name.includes('All')
              ? `sidebar.${toCamelCase(name)}`
              : `transactionTypes.${toCamelCase(name)}`
          )}
          number={
            typeof filteredTransactions !== 'string'
              ? filteredTransactions.filter(
                  transaction =>
                    transaction.type === name.toLowerCase() ||
                    name === 'All Types'
                ).length
              : 0
          }
          sideStripColor={
            {
              'All Types': bgTemp[100],
              Income: colors.green[500],
              Expenses: colors.red[500],
              Transfer: colors.blue[500]
            }[name]
          }
          onCancelButtonClick={
            name !== 'All Types'
              ? () => {
                  searchParams.delete('type')
                  setSearchParams(searchParams)
                }
              : undefined
          }
          onClick={() => {
            if (name === 'All Types') {
              searchParams.delete('type')
              setSearchParams(searchParams)
              setSidebarOpen(false)
              return
            }
            searchParams.delete('category')
            setSearchParams({
              ...Object.fromEntries(searchParams.entries()),
              type: name.toLowerCase()
            })
            setSidebarOpen(false)
          }}
        />
      ))}
    </>
  )
}

export default TypeSection
