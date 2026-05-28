import type { Meta, StoryObj } from '@storybook/react-vite'
import z from 'zod'

import { Button } from '@/components/inputs'
import { useModalStore } from '@/providers'

import { defineForm } from './formBuilder'
import { FormModal } from './index'

type CuteForm = {
  name: string
  age: number
  color: string
  icon: string
  password: string
  confirmPassword: string
}

const meta = {
  argTypes: {
    form: {
      control: false
    },
    'ui.actionButton': {
      control: false,
      description:
        'Action button to be displayed at the top right corner besides the close button.',
      table: {
        type: {
          summary: 'React.ComponentProps<typeof Button>'
        }
      },
      type: {
        required: false,
        summary: 'React.ComponentProps<typeof Button>'
      }
    },
    'ui.icon': {
      description:
        'The icon besides the form title. Must be a valid icon identifier from Iconify in the form of `<icon-set>:<icon-name>`.',
      type: {
        required: true,
        summary: 'string'
      }
    },

    'ui.loading': {
      description:
        'Whether the form modal is in a loading state. A loading spinner will be shown instead of the form fields.'
    },
    'ui.namespace': {
      description:
        'The i18n namespace for internationalization. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details.'
    },
    'ui.onClose': {
      description:
        'Callback function triggered when the close button is clicked.',
      table: {
        type: {
          summary: '() => void'
        }
      },
      type: {
        required: true,
        summary: '() => void'
      }
    },
    'ui.submitButton': {
      control: false,
      description: 'The props for the submit button in the form modal.',
      table: {
        type: {
          summary: "'create' | 'update' | React.ComponentProps<typeof Button>"
        }
      },
      type: {
        required: true,
        summary: "'create' | 'update' | React.ComponentProps<typeof Button>"
      }
    },
    'ui.title': {
      description: 'The title of the form modal.',
      type: {
        required: true,
        summary: 'string'
      }
    }
  } as never,
  component: FormModal,
  parameters: {
    deepControls: { enabled: true }
  }
} satisfies Meta<typeof FormModal>

export default meta

type Story = StoryObj<typeof meta>

const MyFormModal = ({ onClose }: { onClose: () => void }) => {
  const { formProps, formStateStore } = defineForm<CuteForm>({
    actionButton: {
      icon: 'tabler:cube',
      variant: 'plain'
    },
    icon: 'tabler:forms',
    loading: false,
    namespace: '',
    onClose,
    submitButton: 'update',
    title: 'Form Modal'
  })
    .typesMap({
      age: 'number',
      color: 'color',
      confirmPassword: 'text',
      icon: 'listbox',
      name: 'text',
      password: 'text'
    })
    .setupFields({
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
      confirmPassword: {
        icon: 'tabler:lock',
        isPassword: true,
        label: 'Confirm Password',
        placeholder: '••••••••',
        required: true,
        validator: (value, formState) => {
          if (value !== formState.password) {
            return 'Passwords must match'
          }

          return true
        }
      },
      icon: {
        icon: 'tabler:icons',
        label: 'Icon',
        multiple: false,
        options: formState => [
          ...(formState.name === 'Melvin'
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
          {
            icon: 'tabler:check',
            text: 'Check',
            value: 'tabler:check'
          },
          { icon: 'tabler:x', text: 'X', value: 'tabler:x' }
        ],
        required: true
      },
      name: {
        icon: 'tabler:user',
        label: 'Name',
        placeholder: 'John Doe',
        required: true,
        validator: z
          .string()
          .refine(
            value => /^[a-zA-Z ]+$/.test(value),
            'Invalid name. Only alphabetic characters and spaces are allowed.'
          )
      },
      password: {
        actionButtonProps: {
          icon: 'tabler:dice',
          onClick: () => {
            const randomPassword = Math.random().toString(36).slice(-8)

            formStateStore.setState(() => ({
              confirmPassword: randomPassword,
              password: randomPassword
            }))
          },
          variant: 'plain'
        },
        icon: 'tabler:lock',
        isPassword: true,
        label: 'Password',
        placeholder: '••••••••',
        required: true,
        validator: z
          .string()
          .min(8, 'Password must be at least 8 characters long.')
          .max(100, 'Password must be at most 100 characters long.')
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
      loading: false,
      namespace: '',
      onClose: () => {},
      submitButton: 'update',
      title: 'Form Modal'
    }
  } as never,
  render: () => {
    const { open } = useModalStore()

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

/**
 * Story demonstrating a FormModal with a Listbox input that includes an action button option.
 * This action button allows users to perform a custom action, such as opening another modal for adding new options.
 */
export const ListboxInputWithActionButtonOption: Story = {
  args: {
    ui: {
      icon: 'tabler:forms',
      loading: false,
      namespace: '',
      onClose: () => {},
      submitButton: 'create',
      title: 'Form Modal with Listbox Input Action Button Option'
    }
  } as never,
  render: () => {
    const { open } = useModalStore()

    const FormWithListboxInputActionButtonOption = ({
      onClose
    }: {
      onClose: () => void
    }) => {
      const { formProps } = defineForm<{ choice: string | null }>({
        icon: 'tabler:forms',
        namespace: '',
        onClose,
        submitButton: 'create',
        title: 'Form Modal'
      })
        .typesMap({
          choice: 'listbox'
        })
        .setupFields({
          choice: {
            actionButtonOption: {
              icon: 'tabler:plus',
              onClick: () => {
                alert('Add Option clicked!')
              },
              text: 'Add Option'
            },
            icon: 'tabler:list',
            label: 'Choose an option',
            multiple: false,
            options: [
              { icon: 'tabler:number-1', text: 'Option 1', value: 'option1' },
              { icon: 'tabler:number-2', text: 'Option 2', value: 'option2' },
              { icon: 'tabler:number-3', text: 'Option 3', value: 'option3' }
            ],
            required: true
          }
        })
        .onSubmit(async formData => {
          alert(`Form submitted with data: ${JSON.stringify(formData)}`)
        })
        .build()

      return <FormModal {...formProps} />
    }

    return (
      <Button
        icon="tabler:plus"
        onClick={() => {
          open(FormWithListboxInputActionButtonOption, {})
        }}
      >
        Open Form Modal
      </Button>
    )
  }
}

export const DisabledFieldsWithTooltips: Story = {
  args: {
    ui: {
      icon: 'tabler:forms',
      loading: false,
      namespace: '',
      onClose: () => {},
      submitButton: 'create',
      title: 'Form Modal with Disabled Fields and Tooltips'
    }
  } as never,
  render: () => {
    const { open } = useModalStore()

    const FormWithDisabledFieldsAndTooltips = ({
      onClose
    }: {
      onClose: () => void
    }) => {
      const { formProps } = defineForm<{ username: string; email: string }>({
        icon: 'tabler:forms',
        namespace: '',
        onClose,
        submitButton: 'create',
        title: 'Form Modal'
      })
        .typesMap({
          email: 'text',
          username: 'text'
        })
        .setupFields({
          email: {
            disabled: true,
            disabledReason:
              'Email changes are restricted for security reasons.',
            icon: 'tabler:mail',
            label: 'Email',
            placeholder: 'john_doe@example.com'
          },
          username: {
            disabled: true,
            disabledReason: 'Your username cannot be changed once set.',
            icon: 'tabler:user',
            label: 'Username',
            placeholder: 'john_doe'
          }
        })
        .initialData({
          email: 'john_doe@example.com',
          username: 'john_doe'
        })
        .onSubmit(async formData => {
          alert(`Form submitted with data: ${JSON.stringify(formData)}`)
        })
        .build()

      return <FormModal {...formProps} />
    }

    return (
      <Button
        icon="tabler:plus"
        onClick={() => {
          open(FormWithDisabledFieldsAndTooltips, {})
        }}
      >
        Open Form Modal
      </Button>
    )
  }
}
