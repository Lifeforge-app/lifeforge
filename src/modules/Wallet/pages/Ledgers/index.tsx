import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState } from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import { type IWalletLedgerEntry } from '@typedec/Wallet'
import ModifyLedgersModal from './components/ModifyLedgersModal'

function Ledgers(): React.ReactElement {
  const [Ledgers, refreshLedgers] = useFetch<IWalletLedgerEntry[]>(
    'wallet/ledgers/list'
  )
  const [modifyLedgersModalOpenType, setModifyModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [deleteLedgersConfirmationOpen, setDeleteLedgersConfirmationOpen] =
    useState(false)
  const [selectedData, setSelectedData] = useState<IWalletLedgerEntry | null>(
    null
  )

  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Ledgers"
        desc="Manage your Ledgers here."
        actionButton={
          typeof Ledgers !== 'string' &&
          Ledgers.length > 0 && (
            <Button
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
      <APIComponentWithFallback data={Ledgers}>
        {typeof Ledgers !== 'string' && Ledgers.length > 0 ? (
          <div className="mt-8 flex flex-col gap-4">
            {Ledgers.map(ledger => (
              <div
                key={ledger.id}
                className="relative flex flex-col gap-4 rounded-lg bg-bg-100 p-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-min rounded-md p-2"
                    style={{
                      backgroundColor: ledger.color + '20'
                    }}
                  >
                    <Icon
                      icon={ledger.icon}
                      style={{
                        color: ledger.color
                      }}
                      className="h-8 w-8"
                    />
                  </span>
                  <div>
                    <h2 className="text-xl font-medium">{ledger.name}</h2>
                    <p className="text-sm text-bg-500">0 transactions</p>
                  </div>
                </div>
                <HamburgerMenu className="absolute right-4 top-4">
                  <MenuItem
                    icon="tabler:pencil"
                    text="Edit"
                    onClick={() => {
                      setSelectedData(ledger)
                      setModifyModalOpenType('update')
                    }}
                  />
                  <MenuItem
                    icon="tabler:trash"
                    text="Delete"
                    isRed
                    onClick={() => {
                      setSelectedData(ledger)
                      setDeleteLedgersConfirmationOpen(true)
                    }}
                  />
                </HamburgerMenu>
              </div>
            ))}
          </div>
        ) : (
          <EmptyStateScreen
            title="Oops! No Ledger found."
            description="You don't have any Ledgers yet. Add some to get started."
            ctaContent="Add Ledger"
            setModifyModalOpenType={setModifyModalOpenType}
            icon="tabler:wallet-off"
          />
        )}
      </APIComponentWithFallback>
      <ModifyLedgersModal
        existedData={selectedData}
        setExistedData={setSelectedData}
        openType={modifyLedgersModalOpenType}
        setOpenType={setModifyModalOpenType}
        refreshLedgers={refreshLedgers}
      />
      <DeleteConfirmationModal
        apiEndpoint="wallet/Ledgers/delete"
        isOpen={deleteLedgersConfirmationOpen}
        data={selectedData}
        itemName="ledger account"
        onClose={() => {
          setDeleteLedgersConfirmationOpen(false)
          setSelectedData(null)
        }}
        updateDataList={refreshLedgers}
        nameKey="name"
      />
    </ModuleWrapper>
  )
}

export default Ledgers
