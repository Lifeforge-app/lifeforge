import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'

import {
  APIFallbackComponent,
  Button,
  DeleteConfirmationModal,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  ModuleWrapper
} from '@lifeforge/ui'

import { useWalletContext } from '@modules/Wallet/providers/WalletProvider'

import { type IWalletLedger } from '../../interfaces/wallet_interfaces'
import LedgerItem from './components/LedgerItem'
import ModifyLedgersModal from './components/ModifyLedgersModal'

function Ledgers() {
  const { t } = useTranslation('modules.wallet')
  const { ledgers, refreshLedgers } = useWalletContext()
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
          typeof ledgers !== 'string' &&
          ledgers.length > 0 && (
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
        title="Ledgers"
      />
      <APIFallbackComponent data={ledgers}>
        {ledgers =>
          ledgers.length > 0 ? (
            <div className="mb-24 mt-6 space-y-4 md:mb-6">
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
              namespace="modules.wallet"
              onCTAClick={setModifyModalOpenType}
            />
          )
        }
      </APIFallbackComponent>
      <ModifyLedgersModal
        existedData={selectedData}
        openType={modifyLedgersModalOpenType}
        refreshLedgers={refreshLedgers}
        setExistedData={setSelectedData}
        setOpenType={setModifyModalOpenType}
      />
      <DeleteConfirmationModal
        apiEndpoint="wallet/ledgers"
        data={selectedData}
        isOpen={deleteLedgersConfirmationOpen}
        itemName="ledger account"
        nameKey="name"
        updateDataList={refreshLedgers}
        onClose={() => {
          setDeleteLedgersConfirmationOpen(false)
          setSelectedData(null)
        }}
      />
      <FAB
        hideWhen="md"
        onClick={() => {
          setSelectedData(null)
          setModifyModalOpenType('create')
        }}
      />
    </ModuleWrapper>
  )
}

export default Ledgers
