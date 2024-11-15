import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import colors from 'tailwindcss/colors'
import SidebarItem from '@components/Sidebar/components/SidebarItem'
import SidebarTitle from '@components/Sidebar/components/SidebarTitle'
import useThemeColorHex from '@hooks/useThemeColorHex'
import { useWalletContext } from '@providers/WalletProvider'
import { toCamelCase } from '@utils/strings'

function TypeSection({
  setSidebarOpen
}: {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  const { t } = useTranslation()
  const { filteredTransactions } = useWalletContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const { bgTemp } = useThemeColorHex()

  return (
    <>
      <SidebarTitle name="Type" />
      {[
        ['tabler:arrow-bar-both', 'All Assets'],
        ['tabler:login-2', 'Income'],
        ['tabler:logout', 'Expenses'],
        ['tabler:transfer', 'Transfer']
      ].map(([icon, name]) => (
        <SidebarItem
          key={name}
          active={
            searchParams.get('type') === name.toLowerCase() ||
            (searchParams.get('type') === null && name === 'All Assets')
          }
          icon={icon}
          iconColor={
            {
              'All Assets': bgTemp[100],
              Income: colors.green[500],
              Expenses: colors.red[500],
              Transfer: colors.blue[500]
            }[name]
          }
          name={t(`sidebar.wallet.${toCamelCase(name)}`)}
          needTranslate={false}
          number={
            typeof filteredTransactions !== 'string'
              ? filteredTransactions.filter(
                  transaction =>
                    transaction.type === name.toLowerCase() ||
                    name === 'All Assets'
                ).length
              : 0
          }
          onClick={() => {
            if (name === 'All Assets') {
              setSearchParams(searchParams => {
                searchParams.delete('type')
                return searchParams
              })
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
          onCancelButtonClick={
            name !== 'All Assets'
              ? () => {
                  setSearchParams(searchParams => {
                    searchParams.delete('type')
                    return searchParams
                  })
                }
              : undefined
          }
        />
      ))}
    </>
  )
}

export default TypeSection
