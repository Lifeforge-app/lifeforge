import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import type { InferInput } from 'lifeforge-api'
import { type FieldsConfig, FormModal } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import type { ScoreLibraryEntry } from '@apps/ScoresLibrary'

function ModifyEntryModal({
  onClose,
  data: { initialData, queryKey }
}: {
  onClose: () => void
  data: {
    initialData: ScoreLibraryEntry
    queryKey: unknown[]
  }
}) {
  const { t } = useTranslation('apps.scoresLibrary')

  const mutation = useMutation(
    forgeAPI.scoresLibrary.entries.update
      .input({ id: initialData.id })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey })
          onClose()
        }
      })
  )

  const typesQuery = useQuery(forgeAPI.scoresLibrary.types.list.queryOptions())

  const queryClient = useQueryClient()

  const FIELDS = {
    name: {
      required: true,
      label: 'Music Name',
      icon: 'tabler:music',
      placeholder: 'A cool tab',
      type: 'text'
    },
    author: {
      required: true,
      label: 'Author',
      icon: 'tabler:user',
      placeholder: 'John Doe',
      type: 'text'
    },
    type: {
      required: true,
      label: 'Score Type',
      icon: 'tabler:category',
      type: 'listbox',
      options: [
        {
          value: '',
          text: t('scoreTypes.uncategorized'),
          icon: 'tabler:music-off'
        },
        ...(typesQuery.data?.map(({ id, icon, name }) => ({
          value: id,
          text: name,
          icon
        })) || [])
      ]
    }
  } as const satisfies FieldsConfig<
    InferInput<typeof forgeAPI.scoresLibrary.entries.update>['body']
  >

  async function onSubmit(
    data: InferInput<typeof forgeAPI.scoresLibrary.entries.update>['body']
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
      submitButton="update"
      ui={{
        icon: 'tabler:pencil',
        title: 'scoresLibrary.update',
        namespace: 'apps.scoresLibrary',
        onClose,
        loading: typesQuery.isLoading
      }}
    />
  )
}

export default ModifyEntryModal
