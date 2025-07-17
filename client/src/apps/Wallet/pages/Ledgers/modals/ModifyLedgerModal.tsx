import { FormModal } from 'lifeforge-ui'
import type { IFieldProps } from 'lifeforge-ui'
import { useEffect, useState } from 'react'

import {
  type IWalletLedger,
  IWalletLedgerFormState
} from '../../../interfaces/wallet_interfaces'

export default function ModifyLedgerModal({
  data: { type, existedData },
  onClose
}: {
  data: {
    type: 'create' | 'update' | null
    existedData: IWalletLedger | null
  }
  onClose: () => void
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
    if (type === 'update' && existedData) {
      setFormState({
        name: existedData.name,
        icon: existedData.icon,
        color: existedData.color
      })
    } else {
      setFormState({
        name: '',
        icon: '',
        color: ''
      })
    }
  }, [type, existedData])

  return (
    <FormModal
      data={formState}
      endpoint="wallet/ledgers"
      fields={FIELDS}
      icon={type === 'create' ? 'tabler:plus' : 'tabler:pencil'}
      id={existedData?.id}
      namespace="apps.wallet"
      openType={type}
      queryKey={['wallet', 'ledgers']}
      setData={setFormState}
      title={`ledgers.${type}`}
      onClose={onClose}
    />
  )
}
