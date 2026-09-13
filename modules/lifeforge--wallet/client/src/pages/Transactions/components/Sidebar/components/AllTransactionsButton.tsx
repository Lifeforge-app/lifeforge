import { useCallback, useMemo } from 'react'

import { SidebarItem } from '@lifeforge/ui'

import useFilter from '@/hooks/useFilter'

function AllTransactionsButton() {
  const { type, category, asset, ledger, updateFilter } = useFilter()

  const activeState = useMemo(
    () => category === '' && asset === '' && ledger === '' && type === '',
    [category, asset, ledger, type]
  )

  const handleAllTransactionsClick = useCallback(() => {
    updateFilter('type', '')
    updateFilter('category', '')
    updateFilter('asset', '')
    updateFilter('ledger', '')
  }, [updateFilter])

  return (
    <SidebarItem
      active={activeState}
      icon="tabler:list"
      label="allTransactions"
      onClick={handleAllTransactionsClick}
    />
  )
}

export default AllTransactionsButton
