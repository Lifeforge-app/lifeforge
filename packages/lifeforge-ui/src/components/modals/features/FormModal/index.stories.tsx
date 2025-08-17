import ModalWrapper from '@components/modals/core/components/ModalWrapper'
import type { Meta, StoryObj } from '@storybook/react-vite'

import defineForm from './formBuilder'
import Index from './index'
import FormModal from './index'

type CuteForm = {
  title: string
  age: number
  color: string
  icon: string
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
      description: 'The props for the submit button in the form modal.',
      control: false
    },
    'ui.onClose': {
      description:
        'Callback function triggered when the close button is clicked.',
      type: {
        summary: '() => void',
        required: true
      }
    },
    'ui.namespace': {
      description:
        'The i18n namespace for internationalization. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details.'
    },
    'ui.loading': {
      description:
        'Whether the form modal is in a loading state. A loading spinner will be shown instead of the form fields.'
    }
  } as never
} satisfies Meta<typeof Index>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ui: {
      icon: 'tabler:forms',
      title: 'Form Modal',
      namespace: '',
      onClose: () => {},
      loading: false,
      submitButton: {
        icon: 'tabler:check',
        children: 'Submit'
      }
    }
  } as never,
  render: args => {
    const formProps = defineForm<CuteForm>()
      .ui(args.ui)
      .typesMap({
        title: 'text',
        age: 'number',
        color: 'color',
        icon: 'icon'
      })
      .setupFields({
        title: {
          label: 'Title',
          icon: 'tabler:text-size',
          placeholder: 'Title Of The Document',
          required: true,
          validator(value) {
            if (!value.match(/^[a-zA-Z0-9 ]+$/)) {
              return 'Invalid title. Only alphanumeric characters and spaces are allowed.'
            }

            return true
          }
        },
        age: {
          icon: 'tabler:number-123',
          label: 'Age',
          validator: value => {
            if (value < 0) {
              return 'Invalid age. Age must be positive.'
            }

            return true
          }
        },
        color: {
          label: 'Color'
        },
        icon: {
          label: 'Icon',
          required: true
        }
      })
      .initialData({})
      .onSubmit(async formData => {
        alert(`Form submitted with data: ${JSON.stringify(formData)}`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        alert('Form submitted successfully!')
      })
      .build()

    return (
      <ModalWrapper isOpen={true}>
        <FormModal {...formProps} />
      </ModalWrapper>
    )
  }
}
