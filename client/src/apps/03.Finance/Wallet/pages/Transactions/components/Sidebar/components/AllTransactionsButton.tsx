import { SidebarItem } from 'lifeforge-ui'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useWalletStore } from '@apps/03.Finance/Wallet/stores/useWalletStore'

function AllTransactionsButton() {
  const { t } = useTranslation('apps.wallet')

  const {
    selectedType,
    selectedAsset,
    selectedLedger,
    selectedCategory,
    setSelectedType,
    setSelectedCategory,
    setSelectedAsset,
    setSelectedLedger
  } = useWalletStore()

  const activeState = useMemo(
    () =>
      selectedAsset === null &&
      selectedLedger === null &&
      selectedCategory === null &&
      selectedType === null,
    [selectedAsset, selectedLedger, selectedCategory, selectedType]
  )

  const handleAllTransactionsClick = useCallback(() => {
    setSelectedType(null)
    setSelectedCategory(null)
    setSelectedAsset(null)
    setSelectedLedger(null)
  }, [
    setSelectedType,
    setSelectedCategory,
    setSelectedAsset,
    setSelectedLedger
  ])

  return (
    <SidebarItem
      active={activeState}
      icon="tabler:list"
      label={t('sidebar.allTransactions')}
      onClick={handleAllTransactionsClick}
    />
  )
}

export default AllTransactionsButton
