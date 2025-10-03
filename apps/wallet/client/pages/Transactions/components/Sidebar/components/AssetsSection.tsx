import { useWalletData } from '@modules/wallet/client/hooks/useWalletData'
import { SidebarTitle } from 'lifeforge-ui'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import AssetsSectionItem from './AssetsSectionItem'

function AssetsSection() {
  const { t } = useTranslation('apps.wallet')

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
          name: t('sidebar.allAssets'),
          color: 'white',
          id: null,
          amount: undefined
        }
      ].concat(assetsQuery.data ?? ([] as any)),
    [assetsQuery.data, t]
  )

  return (
    <>
      <SidebarTitle
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={handleActionButtonClick}
        label={t('sidebar.assets')}
      />
      {ITEMS.map(({ icon, name, id, amount }) => (
        <AssetsSectionItem
          key={id}
          amount={amount}
          icon={icon}
          id={id}
          label={name}
        />
      ))}
    </>
  )
}

export default AssetsSection
