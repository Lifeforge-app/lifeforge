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
import { type IWalletLedgerEntry } from '@typedec/Wallet'
import APIRequest from '@utils/fetchData'

function ModifyLedgersModal({
  openType,
  setOpenType,
  existedData,
  setExistedData,
  refreshLedgers
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  existedData: IWalletLedgerEntry | null
  setExistedData: React.Dispatch<
    React.SetStateAction<IWalletLedgerEntry | null>
  >
  refreshLedgers: () => void
}): React.ReactElement {
  const [ledgerName, setLedgerName] = useState('')
  const [ledgerIcon, setLedgerIcon] = useState('')
  const [ledgerColor, setLedgerColor] = useState<string>('#FFFFFF')
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false)
  const [colorPickerOpen, setColorPickerOpen] = useState(false)

  useEffect(() => {
    if (openType) {
      if (openType === 'update') {
        if (existedData) {
          setLedgerName(existedData.name)
          setLedgerIcon(existedData.icon)
          setLedgerColor(existedData.color)
        }
      } else {
        setLedgerName('')
        setLedgerIcon('')
        setLedgerColor('#FFFFFF')
      }
    }
  }, [openType, existedData])

  function updateLedgerName(e: React.ChangeEvent<HTMLInputElement>): void {
    setLedgerName(e.target.value)
  }

  function updateLedgerColor(e: React.ChangeEvent<HTMLInputElement>): void {
    setLedgerColor(e.target.value)
  }

  async function onSubmitButtonClick(): Promise<void> {
    if (
      ledgerName.trim().length === 0 ||
      !ledgerColor ||
      ledgerIcon.trim().length === 0
    ) {
      toast.error('Please fill in all the fields.')
      return
    }

    await APIRequest({
      endpoint: `wallet/Ledgers/${openType}`,
      method: openType === 'create' ? 'POST' : 'PATCH',
      body: {
        name: ledgerName,
        icon: ledgerIcon,
        color: ledgerColor
      },
      successInfo: {
        create: 'Yay! Ledger created.',
        update: 'Yay! Ledger updated.'
      }[openType as 'create' | 'update'],
      failureInfo: {
        create: "Oops! Couldn't create the ledger. Please try again.",
        update: "Oops! Couldn't update the ledger. Please try again."
      }[openType as 'create' | 'update'],
      callback: () => {
        refreshLedgers()
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
          title="Add Ledger"
          onClose={() => {
            setOpenType(null)
          }}
        />
        <Input
          icon="tabler:book"
          placeholder="My Ledgers"
          value={ledgerName}
          darker
          name="Ledger name"
          updateValue={updateLedgerName}
        />
        <IconInput
          icon={ledgerIcon}
          setIcon={setLedgerIcon}
          name="Ledger icon"
          setIconSelectorOpen={setIconSelectorOpen}
        />
        <ColorInput
          color={ledgerColor}
          name="Ledger color"
          setColorPickerOpen={setColorPickerOpen}
          updateColor={updateLedgerColor}
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
        setSelectedIcon={setLedgerIcon}
      />
      <ColorPickerModal
        color={ledgerColor}
        isOpen={colorPickerOpen}
        setColor={setLedgerColor}
        setOpen={setColorPickerOpen}
      />
    </>
  )
}

export default ModifyLedgersModal
