import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import type { InferInput } from 'lifeforge-api'
import { FormModal, defineForm } from 'lifeforge-ui'
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

  const formProps = defineForm<
    InferInput<typeof forgeAPI.scoresLibrary.entries.update>['body']
  >()
    .ui({
      icon: 'tabler:pencil',
      title: 'scoresLibrary.update',
      namespace: 'apps.scoresLibrary',
      onClose,
      loading: typesQuery.isLoading,
      submitButton: 'update'
    })
    .typesMap({
      name: 'text',
      author: 'text',
      type: 'listbox'
    })
    .setupFields({
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
        multiple: false,
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
    })
    .initialData(initialData)
    .onSubmit(async data => {
      await mutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyEntryModal
