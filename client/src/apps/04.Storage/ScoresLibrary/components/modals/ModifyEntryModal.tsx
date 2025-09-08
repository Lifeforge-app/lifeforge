import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { FormModal, defineForm } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import type { InferInput } from 'shared'

import type { ScoreLibraryEntry } from '@apps/04.Storage/scoresLibrary'

function ModifyEntryModal({
  onClose,
  data: { initialData }
}: {
  onClose: () => void
  data: {
    initialData: ScoreLibraryEntry
  }
}) {
  const { t } = useTranslation('apps.scoresLibrary')

  const mutation = useMutation(
    forgeAPI.scoresLibrary.entries.update
      .input({ id: initialData.id })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['scoresLibrary'] })
          onClose()
        }
      })
  )

  const typesQuery = useQuery(forgeAPI.scoresLibrary.types.list.queryOptions())

  const collectionsQuery = useQuery(
    forgeAPI.scoresLibrary.collections.list.queryOptions()
  )

  const queryClient = useQueryClient()

  const { formProps } = defineForm<
    InferInput<typeof forgeAPI.scoresLibrary.entries.update>['body']
  >({
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
      type: 'listbox',
      collection: 'listbox'
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
      },
      collection: {
        required: false,
        multiple: false,
        label: 'Collection',
        icon: 'tabler:folder',
        type: 'listbox',
        options: [
          { value: '', text: 'None', icon: 'tabler:folder-off' },
          ...(collectionsQuery.data?.map(({ id, name }) => ({
            value: id,
            text: name,
            icon: 'tabler:folder'
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
