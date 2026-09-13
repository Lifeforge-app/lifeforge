import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'

import { useModuleTranslation } from '@lifeforge/localization'
import { SidebarTitle } from '@lifeforge/ui'

import { useWalletData } from '@/hooks/useWalletData'

import AssetsSectionItem from './AssetsSectionItem'

function AssetsSection() {
  const { t } = useModuleTranslation()
  const { assetsQuery } = useWalletData()
  const navigate = useNavigate()

  const handleActionButtonClick = useCallback(() => {
    navigate('/wallet/assets#new')
  }, [navigate])

  const ITEMS = useMemo(
    () =>
      [
        {
          icon: 'tabler:coin',
          name: 'allAssets',
          color: 'white',
          id: null,
          current_balance: 0
        }
      ].concat(assetsQuery.data ?? ([] as any)),
    [assetsQuery.data, t]
  )

  return (
    <>
      <SidebarTitle
        actionButton={{
          icon: 'tabler:plus',
          onClick: handleActionButtonClick
        }}
        label="assets"
      />
      {ITEMS.map(({ icon, name, id, current_balance }) => (
        <AssetsSectionItem
          key={id}
          amount={current_balance}
          icon={icon}
          id={id}
          label={name}
        />
      ))}
    </>
  )
}

export default AssetsSection
