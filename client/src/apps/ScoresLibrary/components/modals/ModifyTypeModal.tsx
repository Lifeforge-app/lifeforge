import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { FormModal, defineForm } from 'lifeforge-ui'
import type { InferInput } from 'shared'

import type { ScoreLibraryType } from '@apps/ScoresLibrary'

function ModifyTypeModal({
  onClose,
  data: { openType, initialData }
}: {
  onClose: () => void
  data: {
    openType: 'create' | 'update'
    initialData?: ScoreLibraryType
  }
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (openType === 'create'
      ? forgeAPI.scoresLibrary.types.create
      : forgeAPI.scoresLibrary.types.update.input({ id: initialData?.id || '' })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['scoresLibrary'] })
        onClose()
      }
    })
  )

  const formProps = defineForm<
    InferInput<(typeof forgeAPI.scoresLibrary.types)[typeof openType]>['body']
  >()
    .ui({
      icon: openType === 'create' ? 'tabler:plus' : 'tabler:pencil',
      title: `types.${openType}`,
      namespace: 'apps.scoresLibrary',
      onClose,
      submitButton: openType
    })
    .typesMap({
      name: 'text',
      icon: 'icon'
    })
    .setupFields({
      name: {
        required: true,
        label: 'Type Name',
        icon: 'tabler:category',
        placeholder: 'New Type'
      },
      icon: {
        required: true,
        label: 'Type Icon'
      }
    })
    .initialData(initialData)
    .onSubmit(async data => {
      await mutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyTypeModal
