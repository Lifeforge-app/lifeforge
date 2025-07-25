import ModalWrapper from '@components/modals/core/components/ModalWrapper'
import type { Meta, StoryObj } from '@storybook/react'
import { toast } from 'react-toastify'

import Index from './index'
import FormModal from './index'
import { FormFieldConfig } from './typescript/form_interfaces'

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
  render: args => {
    const FIELDS = {
      choice: {
        type: 'listbox',
        label: 'Choice',
        icon: 'tabler:check',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' },
          { value: 'option3', text: 'Option 3' },
          { value: 'option4', text: 'Option 4' },
          { value: 'option5', text: 'Option 5' },
          { value: 'option6', text: 'Option 6' }
        ]
      },
      title: {
        type: 'text',
        label: 'Title',
        icon: 'tabler:title',
        placeholder: 'Enter title here'
      }
    } as const satisfies FormFieldConfig<{
      title: string
      choice:
        | 'option1'
        | 'option2'
        | 'option3'
        | 'option4'
        | 'option5'
        | 'option6'
    }>

    return (
      <ModalWrapper isOpen={true}>
        <FormModal
          {...args}
          form={{
            fields: FIELDS,
            existedData: {
              choice: 'option1',
              title: 'Initial Title'
            },
            onSubmit: async formData => {
              console.log('Form submitted with data:', formData)
              await new Promise(resolve => setTimeout(resolve, 1000))
              toast.success('Form submitted successfully!')
            }
          }}
        />
      </ModalWrapper>
    )
  }
}
