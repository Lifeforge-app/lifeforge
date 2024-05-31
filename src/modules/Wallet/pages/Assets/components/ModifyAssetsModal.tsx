/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import CurrencyInputComponent from '@components/ButtonsAndInputs/CurrencyInput'
import IconSelector from '@components/ButtonsAndInputs/IconSelector'
import IconInput from '@components/ButtonsAndInputs/IconSelector/IconInput'
import Input from '@components/ButtonsAndInputs/Input'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import { type IWalletAssetEntry } from '@typedec/Wallet'
import APIRequest from '@utils/fetchData'

function ModifyAssetsModal({
  openType,
  setOpenType,
  existedData,
  setExistedData,
  refreshAssets
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  existedData: IWalletAssetEntry | null
  setExistedData: React.Dispatch<React.SetStateAction<IWalletAssetEntry | null>>
  refreshAssets: () => void
}): React.ReactElement {
  const [assetName, setAssetName] = useState('')
  const [assetIcon, setAssetIcon] = useState('')
  const [assetBalance, setAssetBalance] = useState<string | undefined>(
    undefined
  )
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false)

  useEffect(() => {
    if (openType) {
      if (openType === 'update') {
        if (existedData) {
          setAssetName(existedData.name)
          setAssetIcon(existedData.icon)
          setAssetBalance(existedData.balance)
        }
      } else {
        setAssetName('')
        setAssetIcon('')
        setAssetBalance(undefined)
      }
    }
  }, [openType, existedData])

  function updateAssetName(e: React.ChangeEvent<HTMLInputElement>): void {
    setAssetName(e.target.value)
  }

  function updateAssetBalance(value: string | undefined): void {
    setAssetBalance(value)
  }

  async function onSubmitButtonClick(): Promise<void> {
    if (
      assetName.trim().length === 0 ||
      !assetBalance ||
      assetIcon.trim().length === 0
    ) {
      toast.error('Please fill in all the fields.')
      return
    }

    await APIRequest({
      endpoint: `wallet/assets/${openType}`,
      method: openType === 'create' ? 'POST' : 'PATCH',
      body: {
        name: assetName,
        icon: assetIcon,
        balance: assetBalance
      },
      successInfo: {
        create: 'Yay! Asset created.',
        update: 'Yay! Asset updated.'
      }[openType as 'create' | 'update'],
      failureInfo: {
        create: "Oops! Couldn't create the asset. Please try again.",
        update: "Oops! Couldn't update the asset. Please try again."
      }[openType as 'create' | 'update'],
      callback: () => {
        refreshAssets()
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
          title="Add Asset"
          onClose={() => {
            setOpenType(null)
          }}
        />
        <Input
          icon="tabler:wallet"
          placeholder="My assets"
          value={assetName}
          darker
          name="Asset name"
          updateValue={updateAssetName}
        />
        <IconInput
          icon={assetIcon}
          setIcon={setAssetIcon}
          name="Asset icon"
          setIconSelectorOpen={setIconSelectorOpen}
        />
        {openType === 'create' && (
          <CurrencyInputComponent
            name="Balance"
            placeholder="0.00"
            icon="tabler:currency-dollar"
            value={assetBalance}
            updateValue={updateAssetBalance}
            darker
            additionalClassName="mt-6"
          />
        )}
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
        setSelectedIcon={setAssetIcon}
      />
    </>
  )
}

export default ModifyAssetsModal
