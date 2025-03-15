import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { FormModal } from '@lifeforge/ui'
import type { IFieldProps } from '@lifeforge/ui'

import fetchAPI from '@utils/fetchAPI'

import {
  type IWalletLedger,
  IWalletLedgerFormState
} from '../../../interfaces/wallet_interfaces'

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
}) {
  const { t } = useTranslation('modules.wallet')
  const [formState, setFormState] = useState<IWalletLedgerFormState>({
    name: '',
    icon: '',
    color: ''
  })

  const FIELDS: IFieldProps<IWalletLedgerFormState>[] = [
    {
      id: 'name',
      label: 'Ledger name',
      icon: 'tabler:book',
      placeholder: 'My Ledgers',
      type: 'text'
    },
    {
      id: 'icon',
      label: 'Ledger icon',
      type: 'icon'
    },
    {
      id: 'color',
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

  async function onSubmit() {
    if (Object.values(formState).some(value => value.trim() === '')) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    try {
      await fetchAPI(
        `wallet/ledgers${openType === 'update' ? '/' + existedData?.id : ''}`,
        {
          method: openType === 'create' ? 'POST' : 'PATCH',
          body: formState
        }
      )

      refreshLedgers()
      setExistedData(null)
      setOpenType(null)
    } catch {
      toast.error(t('input.error.failed'))
    }
  }

  return (
    <FormModal
      data={formState}
      fields={FIELDS}
      icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
      isOpen={openType !== null}
      namespace="modules.wallet"
      openType={openType}
      setData={setFormState}
      title={`ledgers.${openType}`}
      onClose={() => {
        setExistedData(null)
        setOpenType(null)
      }}
      onSubmit={onSubmit}
    />
  )
}

export default ModifyLedgersModal
