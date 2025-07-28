import ModalWrapper from '@components/modals/core/components/ModalWrapper'
import type { Meta, StoryObj } from '@storybook/react'

import Index from './index'
import FormModal from './index'
import defineForm from './utils/FormBuilder'

type CuteForm = {
  title: string
  title2: string
  title3: string
  title4: string
  title5: string
  title6: string
  price: number
  hmmm: File | string
  choice: (
    | 'option1'
    | 'option2'
    | 'option3'
    | 'option4'
    | 'option5'
    | 'option6'
  )[]
}

const meta = {
  component: Index
} satisfies Meta<typeof Index>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ui: {
      title: 'Form Modal',
      onClose: () => {},
      icon: 'tabler:form',
      namespace: 'form-modal',
      loading: false
    }
  } as never,
  render: () => {
    const formProps = defineForm<CuteForm>()
      .ui({
        icon: 'tabler:forms',
        title: 'Form Modal',
        namespace: 'form-modal',
        onClose: () => {},
        loading: false,
        submitButton: {
          icon: 'tabler:check',
          text: 'Submit'
        }
      })
      .typesMap({
        choice: 'listbox',
        price: 'currency',
        title: 'text',
        title2: 'text',
        title3: 'text',
        title4: 'text',
        title5: 'text',
        title6: 'text',
        hmmm: 'file'
      })
      .setupFields({
        choice: {
          multiple: true,
          required: true,
          label: 'Choice',
          icon: 'tabler:check',
          options: [
            {
              value: 'option1',
              text: 'Option 1',
              icon: 'tabler:h-1',
              color: 'blue'
            },
            {
              value: 'option2',
              text: 'Option 2',
              icon: 'tabler:h-2',
              color: 'green'
            },
            {
              value: 'option3',
              text: 'Option 3',
              icon: 'tabler:h-3',
              color: 'red'
            },
            {
              value: 'option4',
              text: 'Option 4',
              icon: 'tabler:h-4',
              color: 'purple'
            },
            {
              value: 'option5',
              text: 'Option 5',
              icon: 'tabler:h-5',
              color: 'orange'
            },
            {
              value: 'option6',
              text: 'Option 6',
              icon: 'tabler:h-6',
              color: 'yellow'
            }
          ]
        },
        price: {
          icon: 'tabler:world-dollar',
          label: 'Price',
          required: true
        },
        title: {
          label: 'Title',
          icon: 'tabler:article',
          placeholder: 'Enter title here'
        },
        title2: {
          label: 'Title 2',
          icon: 'tabler:article',
          placeholder: 'Enter title 2 here'
        },
        title3: {
          label: 'Title 3',
          icon: 'tabler:article',
          placeholder: 'Enter title 3 here'
        },
        title4: {
          label: 'Title 4',
          icon: 'tabler:article',
          placeholder: 'Enter title 4 here'
        },
        title5: {
          label: 'Title 5',
          icon: 'tabler:article',
          placeholder: 'Enter title 5 here'
        },
        title6: {
          label: 'Title 6',
          icon: 'tabler:article',
          placeholder: 'Enter title 6 here'
        },
        hmmm: {
          label: 'Hmmm',
          icon: 'tabler:file',
          required: true,
          optional: false
        }
      })
      .initialData({
        choice: ['option1'],
        title: 'Initial Title'
      })
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
