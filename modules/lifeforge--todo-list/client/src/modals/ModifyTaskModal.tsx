import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useForm, useWatch } from 'react-hook-form'
import z from 'zod'

import { useForgeMutation } from '@lifeforge/api'
import {
  CheckboxField,
  DateField,
  FormModal,
  ListboxField,
  TextAreaField,
  TextField,
  createDefaultValues
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import type { TodoListEntry } from '@/providers/TodoListProvider'

const schema = z.object({
  summary: z.string().min(1, 'Required'),
  notes: z.string(),
  due_date: z.date().nullable(),
  due_date_has_time: z.boolean(),
  list: z.string(),
  tags: z.array(z.string()),
  priority: z.string()
})

function ModifyTaskModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: TodoListEntry | null
  }
  onClose: () => void
}) {
  const listsQuery = useQuery(forgeAPI.lists.list.queryOptions())
  const prioritiesQuery = useQuery(forgeAPI.priorities.list.queryOptions())
  const tagsQuery = useQuery(forgeAPI.tags.list.queryOptions())

  const lists = listsQuery.data ?? []
  const priorities = prioritiesQuery.data ?? []
  const tagsList = tagsQuery.data ?? []

  const createMutation = useForgeMutation(forgeAPI.entries.create, {
    action: 'create',
    queryKey: forgeAPI.key,
    onSuccess: () => onClose()
  })

  const updateMutation = useForgeMutation(
    forgeAPI.entries.update.input({ id: initialData?.id || '' }),
    {
      action: 'update',
      queryKey: forgeAPI.key,
      onSuccess: () => onClose()
    }
  )

  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      summary: initialData?.summary ?? '',
      notes: initialData?.notes ?? '',
      due_date: initialData?.due_date
        ? dayjs(initialData.due_date).toDate()
        : null,
      due_date_has_time: initialData?.due_date_has_time ?? false,
      list: initialData?.list ?? '',
      tags: initialData?.tags ?? [],
      priority: initialData?.priority ?? ''
    },
    resolver: zodResolver(schema)
  })

  const dueDateHasTime = useWatch({
    control: form.control,
    name: 'due_date_has_time'
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        template: type,
        handler: async formData => {
          await (
            type === 'create' ? createMutation : updateMutation
          ).mutateAsync({
            ...formData,
            summary: formData.summary.trim(),
            notes: formData.notes.trim(),
            due_date: formData.due_date
              ? dayjs(formData.due_date).toISOString()
              : ''
          })
        }
      }}
      uiConfig={{
        icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
        namespace: 'apps.todoList',
        title: `tasks.${type}`,
        onClose
      }}
    >
      <TextField
        autoFocus
        required
        control={form.control}
        icon="tabler:abc"
        label="summary"
        name="summary"
        placeholder="An urgent task"
      />
      <CheckboxField
        control={form.control}
        icon="tabler:clock"
        label="has Time"
        name="due_date_has_time"
      />
      <DateField
        control={form.control}
        hasTime={dueDateHasTime}
        icon="tabler:calendar"
        label="dueDate"
        name="due_date"
      />
      <ListboxField
        control={form.control}
        icon="tabler:alert-triangle"
        label="priority"
        name="priority"
        options={[
          { color: 'lightgray', text: 'None', value: '' },
          ...priorities.map(p => ({
            color: p.color,
            text: p.name,
            value: p.id
          }))
        ]}
      />
      <ListboxField
        control={form.control}
        icon="tabler:list"
        label="list"
        name="list"
        options={[
          { color: 'lightgray', text: 'None', value: '' },
          ...lists.map(l => ({ color: l.color, text: l.name, value: l.id }))
        ]}
      />
      <ListboxField
        multiple
        control={form.control}
        icon="tabler:tags"
        label="tags"
        name="tags"
        options={tagsList.map(t => ({
          icon: 'tabler:hash',
          text: t.name,
          value: t.id
        }))}
      />
      <TextAreaField
        control={form.control}
        icon="tabler:pencil"
        label="notes"
        name="notes"
        placeholder="Add notes here..."
      />
    </FormModal>
  )
}

export default ModifyTaskModal
