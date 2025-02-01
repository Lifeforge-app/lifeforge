import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { CreateOrModifyButton } from '@components/buttons'
import {
  CurrencyInput,
  IconInput,
  IconPickerModal,
  TextInput
} from '@components/inputs'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import { type IWalletAsset } from '@interfaces/wallet_interfaces'
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
  existedData: IWalletAsset | null
  setExistedData: React.Dispatch<React.SetStateAction<IWalletAsset | null>>
  refreshAssets: () => void
}): React.ReactElement {
  const { t } = useTranslation()
  const [assetName, setAssetName] = useState('')
  const [assetIcon, setAssetIcon] = useState('')
  const [assetStartingBalance, setAssetStartingBalance] = useState<string>('')
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (openType) {
      if (openType === 'update') {
        if (existedData) {
          setAssetName(existedData.name)
          setAssetIcon(existedData.icon)
          setAssetStartingBalance(`${existedData.starting_balance}`)
        }
      } else {
        setAssetName('')
        setAssetIcon('')
        setAssetStartingBalance('')
      }
    }
  }, [openType, existedData])

  function updateAssetBalance(value: string | undefined): void {
    setAssetStartingBalance(value ?? '')
  }

  async function onSubmitButtonClick(): Promise<void> {
    if (
      assetName.trim().length === 0 ||
      !assetStartingBalance ||
      assetIcon.trim().length === 0
    ) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    setIsLoading(true)
    await APIRequest({
      endpoint: `wallet/assets${
        openType === 'update' ? `/${existedData?.id}` : ''
      }`,
      method: openType === 'create' ? 'POST' : 'PATCH',
      body: {
        name: assetName,
        icon: assetIcon,
        starting_balance: assetStartingBalance
      },
      successInfo: openType,
      failureInfo: openType,
      callback: () => {
        refreshAssets()
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
      <ModalWrapper isOpen={openType !== null} className="sm:min-w-[30rem]">
        <ModalHeader
          icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
          title={`assets.${openType}`}
          namespace="modules.wallet"
          onClose={() => {
            setOpenType(null)
          }}
        />
        <TextInput
          namespace="modules.wallet"
          icon="tabler:wallet"
          placeholder="My assets"
          value={assetName}
          darker
          name="Asset name"
          updateValue={setAssetName}
        />
        <IconInput
          namespace="modules.wallet"
          icon={assetIcon}
          setIcon={setAssetIcon}
          name="Asset icon"
          setIconSelectorOpen={setIconSelectorOpen}
        />
        <CurrencyInput
          namespace="modules.wallet"
          name="Initial Balance"
          placeholder="0.00"
          icon="tabler:currency-dollar"
          value={`${assetStartingBalance}`}
          updateValue={updateAssetBalance}
          darker
          className="mt-6"
        />
        <CreateOrModifyButton
          loading={isLoading}
          onClick={() => {
            onSubmitButtonClick().catch(console.error)
          }}
          type={openType}
        />
      </ModalWrapper>
      <IconPickerModal
        isOpen={iconSelectorOpen}
        setOpen={setIconSelectorOpen}
        setSelectedIcon={setAssetIcon}
      />
    </>
  )
}

export default ModifyAssetsModal
