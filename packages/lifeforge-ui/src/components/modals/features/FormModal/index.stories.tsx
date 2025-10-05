import { Button } from '@components/buttons'
import { useModalStore } from '@components/modals/core/useModalStore'
import type { Meta, StoryObj } from '@storybook/react-vite'
import z from 'zod'

import defineForm from './formBuilder'
import Index from './index'
import FormModal from './index'

type CuteForm = {
  name: string
  age: number
  color: string
  icon: string
  password: string
  confirmPassword: string
}

const meta = {
  component: Index,
  parameters: {
    deepControls: { enabled: true }
  },
  argTypes: {
    form: {
      control: false
    },
    'ui.title': {
      description: 'The title of the form modal.',
      type: {
        summary: 'string',
        required: true
      }
    },
    'ui.icon': {
      description:
        'The icon besides the form title. Must be a valid icon identifier from Iconify in the form of `<icon-set>:<icon-name>`.',
      type: {
        summary: 'string',
        required: true
      }
    },

    'ui.submitButton': {
      type: {
        summary: "'create' | 'update' | React.ComponentProps<typeof Button>",
        required: true
      },
      table: {
        type: {
          summary: "'create' | 'update' | React.ComponentProps<typeof Button>"
        }
      },
      description: 'The props for the submit button in the form modal.',
      control: false
    },
    'ui.onClose': {
      description:
        'Callback function triggered when the close button is clicked.',
      type: {
        summary: '() => void',
        required: true
      },
      table: {
        type: {
          summary: '() => void'
        }
      }
    },
    'ui.namespace': {
      description:
        'The i18n namespace for internationalization. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details.'
    },
    'ui.loading': {
      description:
        'Whether the form modal is in a loading state. A loading spinner will be shown instead of the form fields.'
    },
    'ui.actionButton': {
      description:
        'Action button to be displayed at the top right corner besides the close button.',
      type: {
        summary: 'React.ComponentProps<typeof Button>',
        required: false
      },
      table: {
        type: {
          summary: 'React.ComponentProps<typeof Button>'
        }
      },
      control: false
    }
  } as never
} satisfies Meta<typeof Index>

export default meta

type Story = StoryObj<typeof meta>

const MyFormModal = ({ onClose }: { onClose: () => void }) => {
  const { formProps, formStateStore } = defineForm<CuteForm>({
    icon: 'tabler:forms',
    title: 'Form Modal',
    namespace: '',
    onClose,
    loading: false,
    submitButton: 'update',
    actionButton: {
      icon: 'tabler:cube',
      variant: 'plain'
    }
  })
    .typesMap({
      name: 'text',
      age: 'number',
      color: 'color',
      icon: 'listbox',
      password: 'text',
      confirmPassword: 'text'
    })
    .setupFields({
      name: {
        label: 'Name',
        icon: 'tabler:user',
        placeholder: 'John Doe',
        required: true,
        validator: z
          .string()
          .refine(
            value => /^[a-zA-Z ]+$/.test(value),
            'Invalid name. Only alphabetic characters and spaces are allowed.'
          )
      },
      age: {
        icon: 'tabler:number-123',
        label: 'Age',
        validator: z
          .number()
          .int('Invalid age. Age must be an integer.')
          .nonnegative('Invalid age. Age must be positive.')
      },
      color: {
        label: 'Color'
      },
      icon: {
        multiple: false,
        label: 'Icon',
        icon: 'tabler:icons',
        required: true,
        options: formState => [
          ...(formState.name === 'Melvin'
            ? [
                {
                  text: 'Heart',
                  value: 'tabler:heart',
                  icon: 'tabler:heart',
                  color: '#FF0000'
                }
              ]
            : []),
          { text: 'Star', value: 'tabler:star', icon: 'tabler:star' },
          {
            text: 'Check',
            value: 'tabler:check',
            icon: 'tabler:check'
          },
          { text: 'X', value: 'tabler:x', icon: 'tabler:x' }
        ]
      },
      password: {
        label: 'Password',
        icon: 'tabler:lock',
        placeholder: '••••••••',
        required: true,
        isPassword: true,
        validator: z
          .string()
          .min(8, 'Password must be at least 8 characters long.')
          .max(100, 'Password must be at most 100 characters long.'),
        actionButtonProps: {
          variant: 'plain',
          icon: 'tabler:dice',
          onClick: () => {
            const randomPassword = Math.random().toString(36).slice(-8)

            formStateStore.setState(() => ({
              password: randomPassword,
              confirmPassword: randomPassword
            }))
          }
        }
      },
      confirmPassword: {
        label: 'Confirm Password',
        icon: 'tabler:lock',
        placeholder: '••••••••',
        isPassword: true,
        required: true,
        validator: (value, formState) => {
          if (value !== formState.password) {
            return 'Passwords must match'
          }

          return true
        }
      }
    })
    .autoFocusField('name')
    .conditionalFields({
      // age: data => data.name.trim() !== '',
      // confirmPassword: data => data.password.trim() !== ''
    })
    .initialData({})
    .onSubmit(async formData => {
      alert(`Form submitted with data: ${JSON.stringify(formData)}`)
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Form submitted successfully!')
    })
    .build()

  return <FormModal {...formProps} />
}

export const Default: Story = {
  args: {
    ui: {
      icon: 'tabler:forms',
      title: 'Form Modal',
      namespace: '',
      onClose: () => {},
      loading: false,
      submitButton: 'update'
    }
  } as never,
  render: () => {
    const open = useModalStore(state => state.open)

    return (
      <Button
        icon="tabler:plus"
        onClick={() => {
          open(MyFormModal, {})
        }}
      >
        Open Form Modal
      </Button>
    )
  }
}
