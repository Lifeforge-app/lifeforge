import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import Button from '@components/ButtonsAndInputs/Button'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import { type IWalletLedgerEntry } from '@interfaces/wallet_interfaces'
import { useWalletContext } from '@providers/WalletProvider'
import ModifyLedgersModal from './components/ModifyLedgersModal'

function Ledgers(): React.ReactElement {
  const { ledgers, refreshLedgers, transactions } = useWalletContext()
  const [modifyLedgersModalOpenType, setModifyModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [deleteLedgersConfirmationOpen, setDeleteLedgersConfirmationOpen] =
    useState(false)
  const [selectedData, setSelectedData] = useState<IWalletLedgerEntry | null>(
    null
  )
  const { hash } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (hash === '#new') {
      setSelectedData(null)
      setModifyModalOpenType('create')
      navigate('/wallet/ledgers')
    }
  }, [hash])

  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Ledgers"
        desc="Manage your Ledgers here."
        actionButton={
          typeof ledgers !== 'string' &&
          ledgers.length > 0 && (
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
      <APIComponentWithFallback data={ledgers}>
        {typeof ledgers !== 'string' && ledgers.length > 0 ? (
          <div className="mt-8 flex flex-col gap-4">
            {ledgers.map(ledger => (
              <button
                key={ledger.id}
                type="button"
                onClick={() => {
                  navigate(`/wallet/transactions?ledger=${ledger.id}`)
                }}
                className="relative flex items-center justify-between gap-4 rounded-lg bg-bg-100 p-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] transition-all hover:bg-bg-200/50 dark:bg-bg-900 dark:hover:bg-bg-800/70"
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
                      className="size-8"
                    />
                  </span>
                  <div>
                    <h2 className="text-xl font-medium">{ledger.name}</h2>
                    <p className="text-left text-sm text-bg-500">
                      {typeof transactions !== 'string' &&
                        transactions.filter(
                          transaction => transaction.ledger === ledger.id
                        ).length}{' '}
                      transactions
                    </p>
                  </div>
                </div>
                <HamburgerMenu>
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
              </button>
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
