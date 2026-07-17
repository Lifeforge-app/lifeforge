import { zodResolver } from '@hookform/resolvers/zod'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { Button } from '@/components/inputs'
import { useModalStore } from '@/providers'

import { FormModal } from '.'
import { createDefaultValues } from '../../hooks/createDefaultValues'
import { ColorField, ListboxField, NumberField, TextField } from '../fields'

const meta = {
  component: FormModal,
  parameters: {
    deepControls: { enabled: true }
  },
  title: 'Form/FormModal'
} satisfies Meta<typeof FormModal>

export default meta

type Story = StoryObj<typeof meta>

const cuteFormSchema = z
  .object({
    age: z
      .number()
      .int('Invalid age. Age must be an integer.')
      .nonnegative('Invalid age. Age must be positive.'),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color hex'),
    confirmPassword: z.string(),
    icon: z.enum(['tabler:star', 'tabler:check', 'tabler:x', 'tabler:heart']),
    name: z.string().min(1, 'Name is required'),
    password: z.string().min(8, 'Password must be at least 8 characters')
  })
  .superRefine(function ({ confirmPassword, password }, ctx) {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Password does not match',
        path: ['confirmPassword']
      })
    }
  })

function getIconOptions(name: string) {
  return [
    ...(name === 'melvin'
      ? [
          {
            color: '#FF0000',
            icon: 'tabler:heart',
            text: 'Heart',
            value: 'tabler:heart'
          }
        ]
      : []),
    { icon: 'tabler:star', text: 'Star', value: 'tabler:star' },
    { icon: 'tabler:check', text: 'Check', value: 'tabler:check' },
    { icon: 'tabler:x', text: 'X', value: 'tabler:x' }
  ]
}

function MyFormModal({ onClose }: { onClose: () => void }) {
  const form = useForm({
    defaultValues: {
      ...createDefaultValues(cuteFormSchema),
      color: '#FFFFFF'
    },
    mode: 'all',
    resolver: zodResolver(cuteFormSchema)
  })

  const iconOptions = getIconOptions(form.watch('name'))

  return (
    <FormModal
      form={form}
      submissionConfig={{
        handler: async function (values) {
          alert(JSON.stringify(values))
        },
        template: 'update'
      }}
      uiConfig={{
        icon: 'tabler:forms',
        onClose: onClose,
        title: 'Form Modal'
      }}
    >
      <TextField
        required
        control={form.control}
        icon="tabler:user"
        label="Name"
        name="name"
        placeholder="John Doe"
      />
      <NumberField
        required
        control={form.control}
        icon="tabler:number-123"
        label="Age"
        name="age"
      />
      <ColorField control={form.control} label="Color" name="color" />
      <ListboxField
        required
        control={form.control}
        icon="tabler:icons"
        label="Icon"
        name="icon"
        options={iconOptions}
      />
      <TextField
        isPassword
        required
        actionButtonProps={{
          icon: 'tabler:dice',
          onClick: () => {
            const randomPassword = Math.random().toString(36).slice(-8)

            form.setValue('password', randomPassword, { shouldValidate: true })
            form.setValue('confirmPassword', randomPassword, {
              shouldValidate: true
            })
          },
          variant: 'plain'
        }}
        control={form.control}
        icon="tabler:lock"
        label="Password"
        name="password"
        placeholder="••••••••"
      />
      <TextField
        isPassword
        required
        control={form.control}
        icon="tabler:lock"
        label="Confirm Password"
        name="confirmPassword"
        placeholder="••••••••"
      />
    </FormModal>
  )
}

export const Default: Story = {
  args: {
    ui: {
      icon: 'tabler:forms',
      loading: false,
      namespace: '',
      onClose: () => {},
      submitButton: 'update',
      title: 'Form Modal'
    }
  } as never,
  render: () => {
    const { open } = useModalStore()

    function handleButtonClick() {
      open(MyFormModal, {})
    }

    return (
      <Button icon="tabler:plus" onClick={handleButtonClick}>
        Open Form Modal
      </Button>
    )
  }
}
