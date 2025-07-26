import ModalWrapper from '@components/modals/core/components/ModalWrapper'
import type { Meta, StoryObj } from '@storybook/react'

import Index from './index'
import FormModal from './index'
import defineForm from './utils/defineForm'

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
    const formProps = defineForm<{
      title: string
      price: number
      choice:
        | 'option1'
        | 'option2'
        | 'option3'
        | 'option4'
        | 'option5'
        | 'option6'
    }>()
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
        title: 'text'
      })
      .setupFields({
        choice: {
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
          required: true,
          placeholder: 'Enter price here'
        },
        title: {
          label: 'Title',
          icon: 'tabler:article',
          placeholder: 'Enter title here'
        }
      })
      .initialData({
        choice: 'option1',
        title: 'Initial Title'
      })
      .onSubmit(async formData => {
        alert(`Form submitted with data: ${JSON.stringify(formData)}`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        alert('Form submitted successfully!')
      })

    return (
      <ModalWrapper isOpen={true}>
        <FormModal {...formProps} />
      </ModalWrapper>
    )
  }
}
