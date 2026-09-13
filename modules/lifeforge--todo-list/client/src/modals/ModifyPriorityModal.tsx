import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { useForgeMutation } from '@lifeforge/api'
import {
  ColorField,
  FormModal,
  TextField,
  createDefaultValues
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { TodoListPriority } from '../providers/TodoListProvider'

const schema = z.object({
  name: z.string().min(1, 'Required'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color')
})

function ModifyPriorityModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: TodoListPriority
  }
  onClose: () => void
}) {
  const createMutation = useForgeMutation(forgeAPI.priorities.create, {
    action: 'create',
    queryKey: forgeAPI.key
  })

  const updateMutation = useForgeMutation(
    forgeAPI.priorities.update.input({ id: initialData?.id || '' }),
    {
      action: 'update',
      queryKey: forgeAPI.key
    }
  )

  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      ...(initialData ?? { color: '#FFFFFF' })
    },
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        template: type,
        handler: async data => {
          await (
            type === 'create' ? createMutation : updateMutation
          ).mutateAsync(data)
        }
      }}
      uiConfig={{
        icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
        namespace: 'apps.todoList',
        title: `priority.${type}`,
        onClose
      }}
    >
      <TextField
        required
        control={form.control}
        icon="tabler:sort-ascending-numbers"
        label="priorityName"
        name="name"
        placeholder="Priority name"
      />
      <ColorField
        required
        control={form.control}
        label="priorityColor"
        name="color"
      />
    </FormModal>
  )
}

export default ModifyPriorityModal
