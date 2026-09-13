import { useEffect } from 'react'
import { useLocation } from 'react-router'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  Stack,
  WithQuery,
  useModalStore
} from '@lifeforge/ui'

import { useWalletData } from '@/hooks/useWalletData'

import LedgerItem from './components/LedgerItem'
import ModifyLedgerModal from './modals/ModifyLedgerModal'

function Ledgers() {
  const { t } = useModuleTranslation()
  const { ledgersQuery } = useWalletData()
  const { hash } = useLocation()
  const { open } = useModalStore()

  const handleCreateLedger = () => {
    open(ModifyLedgerModal, {
      type: 'create'
    })
  }

  useEffect(() => {
    if (hash === '#new') {
      open(ModifyLedgerModal, {
        type: 'create'
      })
    }
  }, [hash])

  return (
    <>
      <ModuleHeader
        icon="tabler:book"
        title="ledgers"
        trailing={
          <Button
            display={{ base: 'none', md: 'flex' }}
            icon="tabler:plus"
            tProps={{
              item: t('items.ledger')
            }}
            onClick={handleCreateLedger}
          >
            New
          </Button>
        }
      />
      <WithQuery query={ledgersQuery}>
        {ledgers => (
          <>
            {ledgers.length > 0 ? (
              <Stack mb="lg">
                {ledgers.map(ledger => (
                  <LedgerItem key={ledger.id} ledger={ledger} />
                ))}
              </Stack>
            ) : (
              <EmptyStateScreen
                icon="tabler:wallet-off"
                message={{
                  id: 'ledger'
                }}
              />
            )}
            <FAB visibilityBreakpoint="md" onClick={handleCreateLedger} />
          </>
        )}
      </WithQuery>
    </>
  )
}

export default Ledgers
