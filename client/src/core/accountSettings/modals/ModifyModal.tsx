import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import _ from 'lodash'
import { useForm } from 'react-hook-form'
import { toast } from '@lifeforge/ui'
import z from 'zod'

import { useAuth, type UserData } from '@/providers/AuthProvider'
import {
  DateField,
  FormModal,
  TextField,
  createDefaultValues
} from '@lifeforge/ui'

import forgeAPI from '@/forgeAPI'

const baseSchema = z.object({
  username: z.string(),
  name: z.string(),
  email: z.string(),
  dateOfBirth: z.date()
})

function ModifyModal<TType extends 'datetime' | 'text'>({
  data: { type, title, id, icon },
  onClose
}: {
  data: {
    type: TType
    title: string
    id: 'username' | 'name' | 'email' | 'dateOfBirth'
    icon: string
  }
  onClose: () => void
}) {
  const { userData, setUserData } = useAuth()

  const schema = baseSchema.pick({ [id]: true } as never)

  const mutation = useMutation(
    forgeAPI.user.settings.updateProfile.mutationOptions({
      onSuccess: (_, newData) => {
        if (!userData) return

        if (id === 'email') {
          toast.info('A verification email has been sent to your new email.')
        } else {
          setUserData(oldData => {
            if (!oldData) return null
            return { ...oldData, ...newData.data } as UserData
          })
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

  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      [id]: userData?.[id as keyof typeof userData] || ''
    },
    mode: 'all',
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        handler: async data => {
          await mutation.mutateAsync({ data: { [id]: data[id] } })
        },
        template: 'update'
      }}
      uiConfig={{
        icon: 'tabler:pencil',
        namespace: 'common.accountSettings',
        title: `${_.camelCase(title)}.update`,
        onClose
      }}
    >
      {type === 'datetime' ? (
        <DateField
          required
          control={form.control}
          icon={icon}
          label={title}
          name={id}
        />
      ) : (
        <TextField
          required
          control={form.control}
          icon={icon}
          label={title}
          name={id as never}
          placeholder={`Enter new ${title}`}
        />
      )}
    </FormModal>
  )
}

export default ModifyModal
