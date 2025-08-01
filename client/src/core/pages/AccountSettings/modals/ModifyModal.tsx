import { useMutation } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { FormModal, defineForm } from 'lifeforge-ui'
import _ from 'lodash'
import { toast } from 'react-toastify'

import { useAuth } from '../../../providers/AuthProvider'

function ModifyModal<TType extends 'datetime' | 'text'>({
  data: { type, title, id, icon },
  onClose
}: {
  data: { type: TType; title: string; id: string; icon: string }
  onClose: () => void
}) {
  const { userData, setUserData } = useAuth()

  const mutation = useMutation(
    forgeAPI.user.settings.updateProfile.mutationOptions({
      onSuccess: (_, newData) => {
        if (!userData) return

        if (id === 'email') {
          toast.info('A verification email has been sent to your new email.')
        } else {
          setUserData({ ...userData, ...newData.data })
        }
        toast.success('Profile updated successfully')
      },
      onError: () => {
        if (id === 'email') {
          toast.error('Failed to send verification email.')
        } else {
          toast.error('An error occurred.')
        }
      }
    })
  )

  const formProps = defineForm<{
    [key in string]: string
  }>()
    .ui({
      namespace: 'core.accountSettings',
      icon: 'tabler:pencil',
      title: `${_.camelCase(title)}.update`,
      onClose,
      submitButton: 'update'
    })
    .typesMap({
      [id]: type
    })
    .setupFields({
      [id]: {
        label: title,
        required: true,
        icon,
        placeholder: `Enter new ${title}`
      } as never
    })
    .initialData({
      [id]: userData?.[id as keyof typeof userData] || ''
    })
    .onSubmit(async data => {
      await mutation.mutateAsync({ data })
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyModal
