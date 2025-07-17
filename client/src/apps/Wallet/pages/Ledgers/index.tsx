import {
  Button,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'

import LedgerItem from './components/LedgerItem'
import ModifyLedgerModal from './modals/ModifyLedgerModal'

function Ledgers() {
  const { t } = useTranslation('apps.wallet')
  const { ledgersQuery } = useWalletData()
  const { hash } = useLocation()
  const open = useModalStore(state => state.open)

  const handleCreateLedger = () => {
    open(ModifyLedgerModal, {
      type: 'create',
      existedData: null
    })
  }

  useEffect(() => {
    if (hash === '#new') {
      open(ModifyLedgerModal, {
        type: 'create',
        existedData: null
      })
    }
  }, [hash])

  return (
    <ModuleWrapper>
      <ModuleHeader
        actionButton={
          (ledgersQuery.data ?? []).length > 0 && (
            <Button
              className="hidden md:flex"
              icon="tabler:plus"
              tProps={{
                item: t('items.ledger')
              }}
              onClick={handleCreateLedger}
            >
              New
            </Button>
          )
        }
        icon="tabler:book"
        namespace="apps.wallet"
        title="Ledgers"
        tKey="subsectionsTitleAndDesc"
      />
      <QueryWrapper query={ledgersQuery}>
        {ledgers => (
          <>
            {ledgers.length > 0 ? (
              <div className="mb-24 space-y-4 md:mb-6">
                {ledgers.map(ledger => (
                  <LedgerItem key={ledger.id} ledger={ledger} />
                ))}
              </div>
            ) : (
              <EmptyStateScreen
                ctaContent="new"
                ctaTProps={{
                  item: t('items.ledger')
                }}
                icon="tabler:wallet-off"
                name="ledger"
                namespace="apps.wallet"
                onCTAClick={() => handleCreateLedger()}
              />
            )}
            {ledgers.length > 0 && (
              <FAB hideWhen="md" onClick={handleCreateLedger} />
            )}
          </>
        )}
      </QueryWrapper>
    </ModuleWrapper>
  )
}

export default Ledgers
