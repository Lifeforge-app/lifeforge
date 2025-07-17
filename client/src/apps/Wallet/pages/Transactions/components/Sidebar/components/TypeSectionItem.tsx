import { usePersonalization } from '@providers/PersonalizationProvider'
import { SidebarItem } from 'lifeforge-ui'
import _ from 'lodash'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import colors from 'tailwindcss/colors'

import { useWalletStore } from '@apps/Wallet/stores/useWalletStore'

function TypeSectionItem({
  icon,
  name,
  amount
}: {
  icon: string
  name: string
  amount: number | undefined
}) {
  const { t } = useTranslation('apps.wallet')
  const { bgTempPalette } = usePersonalization()
  const { selectedType, setSelectedType, setSelectedCategory, setSidebarOpen } =
    useWalletStore()

  const sidebarStripColor = useMemo(
    () =>
      ({
        'All Types': bgTempPalette[100],
        Income: colors.green[500],
        Expenses: colors.red[500],
        Transfer: colors.blue[500]
      })[name],
    [bgTempPalette, name]
  )

  const handleCancelButtonClick = useCallback(() => {
    setSelectedType(null)
    setSidebarOpen(false)
  }, [])

  const handleClick = useCallback(() => {
    if (name === 'All Types') {
      setSelectedType(null)
      setSidebarOpen(false)
    } else {
      setSelectedCategory(null)
      setSelectedType(name.toLowerCase() as 'income' | 'expenses' | 'transfer')
      setSidebarOpen(false)
    }
  }, [])

  return (
    <SidebarItem
      active={
        selectedType === name.toLowerCase() ||
        (selectedType === null && name === 'All Types')
      }
      icon={icon}
      name={t(
        name.includes('All')
          ? `sidebar.${_.camelCase(name)}`
          : `transactionTypes.${_.camelCase(name)}`
      )}
      number={amount}
      sideStripColor={sidebarStripColor}
      onCancelButtonClick={
        name !== 'All Types' ? handleCancelButtonClick : undefined
      }
      onClick={handleClick}
    />
  )
}

export default TypeSectionItem
