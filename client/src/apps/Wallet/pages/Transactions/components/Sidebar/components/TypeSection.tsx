import { SidebarTitle } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'

import TypeSectionItem from './TypeSectionItem'

const TYPES = [
  ['tabler:arrow-bar-both', 'All Types'],
  ['tabler:login-2', 'Income'],
  ['tabler:logout', 'Expenses'],
  ['tabler:transfer', 'Transfer']
]

function TypeSection() {
  const { t } = useTranslation('apps.wallet')

  const { typesCountQuery } = useWalletData()

  return (
    <>
      <SidebarTitle name={t('sidebar.transactionTypes')} />
      {TYPES.map(([icon, name]) => (
        <TypeSectionItem
          key={name}
          amount={typesCountQuery.data?.[name.toLowerCase()]?.transactionCount}
          icon={icon}
          name={name}
        />
      ))}
    </>
  )
}

export default TypeSection
