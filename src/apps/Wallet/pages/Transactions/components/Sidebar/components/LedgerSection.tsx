import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { QueryWrapper, SidebarItem, SidebarTitle } from '@lifeforge/ui'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'
import { useWalletStore } from '@apps/Wallet/stores/useWalletStore'

function LedgerSection() {
  const { t } = useTranslation('apps.wallet')
  const { ledgersQuery } = useWalletData()
  const { selectedLedger, setSelectedLedger, setSidebarOpen } = useWalletStore()
  const navigate = useNavigate()

  return (
    <>
      <SidebarTitle
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {
          navigate('/wallet/ledgers#new')
        }}
        name={t('sidebar.ledgers')}
      />
      <QueryWrapper query={ledgersQuery}>
        {ledgers => (
          <>
            {[
              {
                icon: 'tabler:book',
                name: t('sidebar.allLedgers'),
                color: 'white',
                id: null
              }
            ]
              .concat(ledgers as any)
              .map(({ icon, name, color, id }, index) => (
                <SidebarItem
                  key={id}
                  active={
                    selectedLedger === id ||
                    (selectedLedger === null && index === 0)
                  }
                  icon={icon}
                  name={name}
                  number={0}
                  sideStripColor={color}
                  onCancelButtonClick={
                    name !== 'All'
                      ? () => {
                          setSelectedLedger(null)
                          setSidebarOpen(false)
                        }
                      : undefined
                  }
                  onClick={() => {
                    if (name === 'All') {
                      setSelectedLedger(null)
                      return
                    }
                    setSelectedLedger(id)
                    setSidebarOpen(false)
                  }}
                />
              ))}
          </>
        )}
      </QueryWrapper>
    </>
  )
}

export default LedgerSection
