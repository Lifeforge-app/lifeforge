import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import Button from '@components/ButtonsAndInputs/Button'
import FAB from '@components/ButtonsAndInputs/FAB'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIFallbackComponent from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import { type IWalletLedger } from '@interfaces/wallet_interfaces'
import { useWalletContext } from '@providers/WalletProvider'
import LedgerItem from './components/LedgerItem'
import ModifyLedgersModal from './components/ModifyLedgersModal'

function Ledgers(): React.ReactElement {
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
        icon="tabler:book"
        title="Ledgers"
        actionButton={
          typeof ledgers !== 'string' &&
          ledgers.length > 0 && (
            <Button
              className="hidden md:flex"
              onClick={() => {
                setModifyModalOpenType('create')
              }}
              icon="tabler:plus"
            >
              Add Ledger
            </Button>
          )
        }
      />
      <APIFallbackComponent data={ledgers}>
        {ledgers =>
          ledgers.length > 0 ? (
            <div className="mt-6 space-y-4">
              {ledgers.map(ledger => (
                <LedgerItem
                  key={ledger.id}
                  ledger={ledger}
                  setModifyModalOpenType={setModifyModalOpenType}
                  setDeleteLedgersConfirmationOpen={
                    setDeleteLedgersConfirmationOpen
                  }
                  setSelectedData={setSelectedData}
                />
              ))}
            </div>
          ) : (
            <EmptyStateScreen
              title={t('emptyState.wallet.ledger.title')}
              description={t('emptyState.wallet.ledger.description')}
              ctaContent="Add Ledger"
              onCTAClick={setModifyModalOpenType}
              icon="tabler:wallet-off"
            />
          )
        }
      </APIFallbackComponent>
      <ModifyLedgersModal
        existedData={selectedData}
        setExistedData={setSelectedData}
        openType={modifyLedgersModalOpenType}
        setOpenType={setModifyModalOpenType}
        refreshLedgers={refreshLedgers}
      />
      <DeleteConfirmationModal
        apiEndpoint="wallet/ledgers"
        isOpen={deleteLedgersConfirmationOpen}
        data={selectedData}
        itemName="ledger account"
        onClose={() => {
          setDeleteLedgersConfirmationOpen(false)
          setSelectedData(null)
        }}
        updateDataLists={refreshLedgers}
        nameKey="name"
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
