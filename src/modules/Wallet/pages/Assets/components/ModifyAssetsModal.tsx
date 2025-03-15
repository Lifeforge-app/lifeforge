import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { FormModal } from '@lifeforge/ui'
import type { IFieldProps } from '@lifeforge/ui'

import fetchAPI from '@utils/fetchAPI'

import type {
  IWalletAsset,
  IWalletAssetFormState
} from '../../../interfaces/wallet_interfaces'

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
}) {
  const { t } = useTranslation('modules.wallet')
  const [formState, setFormState] = useState<IWalletAssetFormState>({
    name: '',
    icon: '',
    starting_balance: ''
  })

  const FIELDS: IFieldProps<IWalletAssetFormState>[] = [
    {
      id: 'name',
      label: 'Asset name',
      icon: 'tabler:wallet',
      placeholder: 'My assets',
      type: 'text'
    },
    {
      id: 'icon',
      label: 'Asset icon',
      type: 'icon'
    },
    {
      id: 'starting_balance',
      label: 'Initial Balance',
      icon: 'tabler:currency-dollar',
      placeholder: '0.00',
      type: 'text'
    }
  ]

  useEffect(() => {
    if (openType) {
      if (openType === 'update') {
        if (existedData) {
          setFormState({
            name: existedData.name,
            icon: existedData.icon,
            starting_balance: existedData.starting_balance.toString()
          })
        }
      } else {
        setFormState({
          name: '',
          icon: '',
          starting_balance: ''
        })
      }
    }
  }, [openType, existedData])

  async function onSubmit() {
    if (
      Object.values(formState).some(value => value.trim() === '') &&
      !parseFloat(formState.starting_balance)
    ) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    try {
      await fetchAPI(
        `wallet/assets${openType === 'update' ? '/' + existedData?.id : ''}`,
        {
          method: openType === 'create' ? 'POST' : 'PATCH',
          body: formState
        }
      )

      refreshAssets()
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
      title={`assets.${openType}`}
      onClose={() => {
        setExistedData(null)
        setOpenType(null)
      }}
      onSubmit={onSubmit}
    />
  )
}

export default ModifyAssetsModal
