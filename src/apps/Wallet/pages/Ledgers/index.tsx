import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'

import {
  Button,
  DeleteConfirmationModal,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper
} from '@lifeforge/ui'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'

import { type IWalletLedger } from '../../interfaces/wallet_interfaces'
import LedgerItem from './components/LedgerItem'
import ModifyLedgersModal from './components/ModifyLedgersModal'

function Ledgers() {
  const { t } = useTranslation('apps.wallet')
  const { ledgersQuery } = useWalletData()
  const [modifyLedgersModalOpenType, setModifyModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [deleteLedgersConfirmationOpen, setDeleteLedgersConfirmationOpen] =
    useState(false)
  const [selectedData, setSelectedData] = useState<IWalletLedger | null>(null)
  const { hash } = useLocation()

  useEffect(() => {
    if (hash === '#new') {
      setSelectedData(null)
      setModifyModalOpenType('create')
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
              onClick={() => {
                setModifyModalOpenType('create')
              }}
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
              <div className="mt-6 mb-24 space-y-4 md:mb-6">
                {ledgers.map(ledger => (
                  <LedgerItem
                    key={ledger.id}
                    ledger={ledger}
                    setDeleteLedgersConfirmationOpen={
                      setDeleteLedgersConfirmationOpen
                    }
                    setModifyModalOpenType={setModifyModalOpenType}
                    setSelectedData={setSelectedData}
                  />
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
                onCTAClick={setModifyModalOpenType}
              />
            )}
            {ledgers.length > 0 && (
              <FAB
                hideWhen="md"
                onClick={() => {
                  setSelectedData(null)
                  setModifyModalOpenType('create')
                }}
              />
            )}
          </>
        )}
      </QueryWrapper>
      <ModifyLedgersModal
        existedData={selectedData}
        openType={modifyLedgersModalOpenType}
        setExistedData={setSelectedData}
        setOpenType={setModifyModalOpenType}
      />
      <DeleteConfirmationModal
        apiEndpoint="wallet/ledgers"
        confirmationText="Delete this ledger account"
        data={selectedData ?? undefined}
        isOpen={deleteLedgersConfirmationOpen}
        itemName="ledger account"
        nameKey="name"
        queryKey={['wallet', 'ledgers']}
        onClose={() => {
          setDeleteLedgersConfirmationOpen(false)
          setSelectedData(null)
        }}
      />
    </ModuleWrapper>
  )
}

export default Ledgers
