import { useQueryClient } from '@tanstack/react-query'
import { FormModal, IFieldProps } from 'lifeforge-ui'
import { useState } from 'react'

import {
  ISchemaWithPB,
  ScoresLibraryCollectionsSchemas
} from 'shared/types/collections'
import { ScoresLibraryControllersSchemas } from 'shared/types/controllers'

function ModifyTypeModal({
  onClose,
  data: { openType, existedData }
}: {
  onClose: () => void
  data: {
    openType: 'create' | 'update'
    existedData: ISchemaWithPB<ScoresLibraryCollectionsSchemas.ITypeAggregated> | null
  }
}) {
  const queryClient = useQueryClient()

  const [formState, setFormState] = useState<
    | ScoresLibraryControllersSchemas.ITypes['createType']['body']
    | ScoresLibraryControllersSchemas.ITypes['updateType']['body']
  >({
    name: '',
    icon: ''
  })

  const FIELDS: IFieldProps<typeof formState>[] = [
    {
      id: 'name',
      required: true,
      label: 'Type Name',
      icon: 'tabler:category',
      placeholder: 'New Type',
      type: 'text'
    },
    {
      id: 'icon',
      required: true,
      label: 'Type Icon',
      type: 'icon'
    }
  ]

  return (
    <FormModal
      customUpdateDataList={{
        create: () => {
          queryClient.invalidateQueries({
            queryKey: ['scores-library', 'types']
          })
          queryClient.invalidateQueries({
            queryKey: ['scores-library', 'sidebar-data']
          })
        },
        update: () => {
          queryClient.invalidateQueries({
            queryKey: ['scores-library', 'types']
          })
          queryClient.invalidateQueries({
            queryKey: ['scores-library', 'sidebar-data']
          })
        }
      }}
      data={formState}
      endpoint="scores-library/types"
      fields={FIELDS}
      icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
      id={existedData?.id}
      namespace="apps.scoresLibrary"
      openType={openType}
      queryKey={['scores-library', 'types']}
      setData={setFormState}
      title={`types.${openType}`}
      onClose={onClose}
    />
  )
}

export default ModifyTypeModal
