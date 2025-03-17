import { useEffect, useState } from 'react'

import { FormModal } from '@lifeforge/ui'
import type { IFieldProps } from '@lifeforge/ui'

import {
  type IWalletLedger,
  IWalletLedgerFormState
} from '../../../interfaces/wallet_interfaces'

function ModifyLedgersModal({
  openType,
  setOpenType,
  existedData,
  setExistedData
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  existedData: IWalletLedger | null
  setExistedData: React.Dispatch<React.SetStateAction<IWalletLedger | null>>
}) {
  const [formState, setFormState] = useState<IWalletLedgerFormState>({
    name: '',
    icon: '',
    color: ''
  })

  const FIELDS: IFieldProps<IWalletLedgerFormState>[] = [
    {
      id: 'name',
      required: true,
      label: 'Ledger name',
      icon: 'tabler:book',
      placeholder: 'My Ledgers',
      type: 'text'
    },
    {
      id: 'icon',
      required: true,
      label: 'Ledger icon',
      type: 'icon'
    },
    {
      id: 'color',
      required: true,
      label: 'Ledger color',
      type: 'color'
    }
  ]

  useEffect(() => {
    if (openType) {
      if (openType === 'update') {
        if (existedData) {
          setFormState({
            name: existedData.name,
            icon: existedData.icon,
            color: existedData.color
          })
        }
      } else {
        setFormState({
          name: '',
          icon: '',
          color: ''
        })
      }
    }
  }, [openType, existedData])

  return (
    <FormModal
      data={formState}
      endpoint="wallet/ledgers"
      fields={FIELDS}
      icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
      id={existedData?.id}
      isOpen={openType !== null}
      namespace="modules.wallet"
      openType={openType}
      queryKey={['wallet', 'ledgers']}
      setData={setFormState}
      title={`ledgers.${openType}`}
      onClose={() => {
        setExistedData(null)
        setOpenType(null)
      }}
    />
  )
}

export default ModifyLedgersModal
