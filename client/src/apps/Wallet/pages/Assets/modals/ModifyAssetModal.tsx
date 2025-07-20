import { FormModal } from 'lifeforge-ui'
import type { IFieldProps } from 'lifeforge-ui'
import { useEffect, useState } from 'react'

import {
  ISchemaWithPB,
  WalletCollectionsSchemas
} from 'shared/types/collections'
import { WalletControllersSchemas } from 'shared/types/controllers'

function ModifyAssetModal({
  data: { type, existedData },
  onClose
}: {
  data: {
    type: 'create' | 'update' | null
    existedData: ISchemaWithPB<WalletCollectionsSchemas.IAssetAggregated> | null | null
  }
  onClose: () => void
}) {
  const [formState, setFormState] = useState<
    WalletControllersSchemas.IAssets['createAsset' | 'updateAsset']['body']
  >({
    name: '',
    icon: '',
    starting_balance: 0
  })

  const FIELDS: IFieldProps<typeof formState>[] = [
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
      type: 'number'
    }
  ]

  useEffect(() => {
    if (type) {
      if (type === 'update') {
        if (existedData) {
          setFormState({
            name: existedData.name,
            icon: existedData.icon,
            starting_balance: existedData.starting_balance
          })
        }
      } else {
        setFormState({
          name: '',
          icon: '',
          starting_balance: 0
        })
      }
    }
  }, [type, existedData])

  return (
    <FormModal
      data={formState}
      endpoint="wallet/assets"
      fields={FIELDS}
      icon={type === 'create' ? 'tabler:plus' : 'tabler:pencil'}
      id={existedData?.id}
      namespace="apps.wallet"
      openType={type}
      queryKey={['wallet', 'assets']}
      setData={setFormState}
      title={`assets.${type}`}
      onClose={onClose}
    />
  )
}

export default ModifyAssetModal
