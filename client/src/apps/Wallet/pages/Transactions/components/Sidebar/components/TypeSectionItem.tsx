import { SidebarItem } from 'lifeforge-ui'
import _ from 'lodash'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { usePersonalization } from 'shared'
import colors from 'tailwindcss/colors'

import { useWalletStore } from '@apps/Wallet/stores/useWalletStore'

function TypeSectionItem({
  icon,
  label,
  amount
}: {
  icon: string
  label: string
  amount: number | undefined
}) {
  const { t } = useTranslation('apps.wallet')

  const { bgTempPalette } = usePersonalization()

  const { selectedType, setSelectedType, setSelectedCategory } =
    useWalletStore()

  const sidebarStripColor = useMemo(
    () =>
      ({
        'All Types': bgTempPalette[100],
        Income: colors.green[500],
        Expenses: colors.red[500],
        Transfer: colors.blue[500]
      })[label],
    [bgTempPalette, label]
  )

  const handleCancelButtonClick = useCallback(() => {
    setSelectedType(null)
  }, [])

  const handleClick = useCallback(() => {
    if (label === 'All Types') {
      setSelectedType(null)
    } else {
      setSelectedCategory(null)
      setSelectedType(label.toLowerCase() as 'income' | 'expenses' | 'transfer')
    }
  }, [])

  return (
    <SidebarItem
      active={
        selectedType === label.toLowerCase() ||
        (selectedType === null && label === 'All Types')
      }
      icon={icon}
      label={t(
        label.includes('All')
          ? `sidebar.${_.camelCase(label)}`
          : `transactionTypes.${_.camelCase(label)}`
      )}
      number={amount}
      sideStripColor={sidebarStripColor}
      onCancelButtonClick={
        label !== 'All Types' ? handleCancelButtonClick : undefined
      }
      onClick={handleClick}
    />
  )
}

export default TypeSectionItem
