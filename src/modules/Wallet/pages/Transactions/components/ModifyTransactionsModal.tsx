/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ColorInput from '@components/ButtonsAndInputs/ColorPicker/ColorInput'
import ColorPickerModal from '@components/ButtonsAndInputs/ColorPicker/ColorPickerModal'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import IconSelector from '@components/ButtonsAndInputs/IconSelector'
import IconInput from '@components/ButtonsAndInputs/IconSelector/IconInput'
import Input from '@components/ButtonsAndInputs/Input'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import { type IWalletTransactionEntry } from '@typedec/Wallet'
import APIRequest from '@utils/fetchData'

function ModifyTransactionsModal({
  openType,
  setOpenType,
  existedData,
  setExistedData,
  refreshTransactions
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  existedData: IWalletTransactionEntry | null
  setExistedData: React.Dispatch<
    React.SetStateAction<IWalletTransactionEntry | null>
  >
  refreshTransactions: () => void
}): React.ReactElement {
  const [transactionName, setTransactionName] = useState('')
  const [transactionIcon, setTransactionIcon] = useState('')
  const [transactionColor, setTransactionColor] = useState<string>('#FFFFFF')
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false)
  const [colorPickerOpen, setColorPickerOpen] = useState(false)

  useEffect(() => {
    if (openType) {
      if (openType === 'update') {
        if (existedData) {
          console.log('TODO')
        }
      } else {
        setTransactionName('')
        setTransactionIcon('')
        setTransactionColor('#FFFFFF')
      }
    }
  }, [openType, existedData])

  function updateTransactionName(e: React.ChangeEvent<HTMLInputElement>): void {
    setTransactionName(e.target.value)
  }

  function updateTransactionColor(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    setTransactionColor(e.target.value)
  }

  async function onSubmitButtonClick(): Promise<void> {
    if (
      transactionName.trim().length === 0 ||
      !transactionColor ||
      transactionIcon.trim().length === 0
    ) {
      toast.error('Please fill in all the fields.')
      return
    }

    await APIRequest({
      endpoint: `wallet/Transactions/${openType}`,
      method: openType === 'create' ? 'POST' : 'PATCH',
      body: {
        name: transactionName,
        icon: transactionIcon,
        color: transactionColor
      },
      successInfo: {
        create: 'Yay! Transaction created.',
        update: 'Yay! Transaction updated.'
      }[openType as 'create' | 'update'],
      failureInfo: {
        create: "Oops! Couldn't create the transaction. Please try again.",
        update: "Oops! Couldn't update the transaction. Please try again."
      }[openType as 'create' | 'update'],
      callback: () => {
        refreshTransactions()
        setExistedData(null)
        setOpenType(null)
      }
    })
  }

  return (
    <>
      {' '}
      <Modal isOpen={openType !== null} minWidth="30rem">
        <ModalHeader
          icon="tabler:plus"
          title="Add Transaction"
          onClose={() => {
            setOpenType(null)
          }}
        />
        <Input
          icon="tabler:book"
          placeholder="My Transactions"
          value={transactionName}
          darker
          name="Transaction name"
          updateValue={updateTransactionName}
        />
        <IconInput
          icon={transactionIcon}
          setIcon={setTransactionIcon}
          name="Transaction icon"
          setIconSelectorOpen={setIconSelectorOpen}
        />
        <ColorInput
          color={transactionColor}
          name="Transaction color"
          setColorPickerOpen={setColorPickerOpen}
          updateColor={updateTransactionColor}
        />
        <CreateOrModifyButton
          loading={false}
          onClick={() => {
            onSubmitButtonClick().catch(console.error)
          }}
          type="create"
        />
      </Modal>
      <IconSelector
        isOpen={iconSelectorOpen}
        setOpen={setIconSelectorOpen}
        setSelectedIcon={setTransactionIcon}
      />
      <ColorPickerModal
        color={transactionColor}
        isOpen={colorPickerOpen}
        setColor={setTransactionColor}
        setOpen={setColorPickerOpen}
      />
    </>
  )
}

export default ModifyTransactionsModal
