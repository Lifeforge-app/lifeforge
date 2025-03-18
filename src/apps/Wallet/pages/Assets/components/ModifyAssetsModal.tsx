import { useEffect, useState } from 'react'

import { FormModal } from '@lifeforge/ui'
import type { IFieldProps } from '@lifeforge/ui'

import type {
  IWalletAsset,
  IWalletAssetFormState
} from '../../../interfaces/wallet_interfaces'

function ModifyAssetsModal({
  openType,
  setOpenType,
  existedData,
  setExistedData
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  existedData: IWalletAsset | null
  setExistedData: React.Dispatch<React.SetStateAction<IWalletAsset | null>>
}) {
  const [formState, setFormState] = useState<IWalletAssetFormState>({
    name: '',
    icon: '',
    starting_balance: ''
  })

  const FIELDS: IFieldProps<IWalletAssetFormState>[] = [
    {
      id: 'name',
      required: true,
      label: 'Asset name',
      icon: 'tabler:wallet',
      placeholder: 'My assets',
      type: 'text'
    },
    {
      id: 'icon',
      required: true,
      label: 'Asset icon',
      type: 'icon'
    },
    {
      id: 'starting_balance',
      required: true,
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

  return (
    <FormModal
      data={formState}
      endpoint="wallet/assets"
      fields={FIELDS}
      icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
      id={existedData?.id}
      isOpen={openType !== null}
      namespace="apps.wallet"
      openType={openType}
      queryKey={['wallet', 'assets']}
      setData={setFormState}
      title={`assets.${openType}`}
      onClose={() => {
        setExistedData(null)
        setOpenType(null)
      }}
    />
  )
}

export default ModifyAssetsModal
