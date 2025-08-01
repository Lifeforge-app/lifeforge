import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { FormModal, defineForm } from 'lifeforge-ui'
import _ from 'lodash'
import { toast } from 'react-toastify'
import type { InferInput } from 'shared'

function ModifyModal({
  onClose,
  data: { type, initialData, stuff }
}: {
  onClose: () => void
  data: {
    type: 'create' | 'update'
    initialData: any
    stuff: 'collections' | 'languages'
  }
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.booksLibrary[stuff].create
      : forgeAPI.booksLibrary[stuff].update.input({
          id: initialData?.id || ''
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['booksLibrary', stuff] })
      },
      onError: () => {
        toast.error(`Failed to ${type} ${_.camelCase(stuff)}`)
      }
    })
  )

  const singleStuff = {
    collections: 'collection',
    languages: 'language'
  }[stuff]

  const formProps = defineForm<
    InferInput<
      (typeof forgeAPI.booksLibrary)[typeof stuff][typeof type]
    >['body']
  >()
    .ui({
      icon: type === 'update' ? 'tabler:pencil' : 'tabler:plus',
      namespace: 'apps.booksLibrary',
      title: `${_.camelCase(singleStuff)}.${type}`,
      onClose,
      submitButton: type
    })
    .typesMap({
      name: 'text',
      icon: 'icon'
    })
    .setupFields({
      name: {
        label: `${singleStuff} name`,
        icon: 'tabler:book',
        required: true,
        placeholder: `Project ${singleStuff}`,
        type: 'text'
      },
      icon: {
        label: `${singleStuff} icon`,
        type: 'icon',
        required: true
      }
    })
    .initialData(initialData)
    .onSubmit(async data => {
      await mutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyModal
