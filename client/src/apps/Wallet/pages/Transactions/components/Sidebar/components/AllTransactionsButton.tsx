import { SidebarItem } from 'lifeforge-ui'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useWalletStore } from '@apps/Wallet/stores/useWalletStore'

function AllTransactionsButton() {
  const { t } = useTranslation('apps.wallet')

  const {
    selectedType,
    selectedAsset,
    selectedLedger,
    selectedCategory,
    setSidebarOpen,
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
    setSidebarOpen(false)
    setSelectedType(null)
    setSelectedCategory(null)
    setSelectedAsset(null)
    setSelectedLedger(null)
  }, [
    setSidebarOpen,
    setSelectedType,
    setSelectedCategory,
    setSelectedAsset,
    setSelectedLedger
  ])

  return (
    <SidebarItem
      active={activeState}
      icon="tabler:list"
      name={t('sidebar.allTransactions')}
      onClick={handleAllTransactionsClick}
    />
  )
}

export default AllTransactionsButton
