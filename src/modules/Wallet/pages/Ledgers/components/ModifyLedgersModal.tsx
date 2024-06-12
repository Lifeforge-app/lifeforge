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
import { type IWalletLedgerEntry } from '@interfaces/wallet_interfaces'
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
  const [isLoading, setIsLoading] = useState(false)

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

    setIsLoading(true)
    await APIRequest({
      endpoint: `wallet/ledgers/${openType}${
        openType === 'update' ? `/${existedData?.id}` : ''
      }`,
      method: openType === 'create' ? 'POST' : 'PATCH',
      body: {
        name: ledgerName,
        icon: ledgerIcon,
        color: ledgerColor
      },
      successInfo: openType,
      failureInfo: openType,
      callback: () => {
        refreshLedgers()
        setExistedData(null)
        setOpenType(null)
      },
      finalCallback: () => {
        setIsLoading(false)
      }
    })
  }

  return (
    <>
      {' '}
      <Modal isOpen={openType !== null} minWidth="30rem">
        <ModalHeader
          icon={openType === 'update' ? 'tabler:pencil' : 'tabler:plus'}
          title={openType === 'update' ? 'Edit Ledger' : 'Add Ledger'}
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
          loading={isLoading}
          onClick={() => {
            onSubmitButtonClick().catch(console.error)
          }}
          type={openType}
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
