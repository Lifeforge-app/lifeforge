import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { CreateOrModifyButton } from '@components/buttons'
import {
  ColorInput,
  ColorPickerModal,
  IconInput,
  IconPickerModal,
  TextInput
} from '@components/inputs'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import { type IWalletLedger } from '@interfaces/wallet_interfaces'
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
  existedData: IWalletLedger | null
  setExistedData: React.Dispatch<React.SetStateAction<IWalletLedger | null>>
  refreshLedgers: () => void
}): React.ReactElement {
  const { t } = useTranslation('modules.wallet')
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

  async function onSubmitButtonClick(): Promise<void> {
    if (
      ledgerName.trim().length === 0 ||
      !ledgerColor ||
      ledgerIcon.trim().length === 0
    ) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    setIsLoading(true)
    await APIRequest({
      endpoint: `wallet/ledgers${
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
      <ModalWrapper className="sm:min-w-[30rem]" isOpen={openType !== null}>
        <ModalHeader
          icon={openType === 'update' ? 'tabler:pencil' : 'tabler:plus'}
          namespace="modules.wallet"
          title={`ledgers.${openType}`}
          onClose={() => {
            setOpenType(null)
          }}
        />
        <TextInput
          darker
          icon="tabler:book"
          name="Ledger name"
          namespace="modules.wallet"
          placeholder="My Ledgers"
          updateValue={setLedgerName}
          value={ledgerName}
        />
        <IconInput
          icon={ledgerIcon}
          name="Ledger icon"
          namespace="modules.wallet"
          setIcon={setLedgerIcon}
          setIconSelectorOpen={setIconSelectorOpen}
        />
        <ColorInput
          color={ledgerColor}
          name="Ledger color"
          namespace="modules.wallet"
          setColorPickerOpen={setColorPickerOpen}
          updateColor={setLedgerColor}
        />
        <CreateOrModifyButton
          loading={isLoading}
          type={openType}
          onClick={() => {
            onSubmitButtonClick().catch(console.error)
          }}
        />
      </ModalWrapper>
      <IconPickerModal
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
