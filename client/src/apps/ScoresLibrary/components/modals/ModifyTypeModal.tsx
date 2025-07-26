import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import type { InferInput } from 'lifeforge-api'
import { type FieldsConfig, FormModal } from 'lifeforge-ui'

import type { ScoreLibraryEntry } from '@apps/ScoresLibrary'

function ModifyTypeModal({
  onClose,
  data: { openType, initialData }
}: {
  onClose: () => void
  data: {
    openType: 'create' | 'update'
    initialData?: ScoreLibraryEntry
  }
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (openType === 'create'
      ? forgeAPI.scoresLibrary.types.create
      : forgeAPI.scoresLibrary.types.update.input({ id: initialData!.id })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['scoresLibrary'] })
        onClose()
      }
    })
  )

  const FIELDS = {
    name: {
      required: true,
      label: 'Type Name',
      icon: 'tabler:category',
      placeholder: 'New Type',
      type: 'text'
    },
    icon: {
      required: true,
      label: 'Type Icon',
      type: 'icon'
    }
  } as const satisfies FieldsConfig<
    InferInput<(typeof forgeAPI.scoresLibrary.types)[typeof openType]>['body']
  >

  async function onSubmit(
    data: InferInput<
      (typeof forgeAPI.scoresLibrary.types)[typeof openType]
    >['body']
  ) {
    await mutation.mutateAsync(data)
  }

  return (
    <FormModal
      form={{
        fields: FIELDS,
        initialData,
        onSubmit
      }}
      submitButton={openType}
      ui={{
        icon: openType === 'create' ? 'tabler:plus' : 'tabler:pencil',
        title: `types.${openType}`,
        namespace: 'apps.scoresLibrary',
        onClose
      }}
    />
  )
}

export default ModifyTypeModal
