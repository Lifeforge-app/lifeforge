import ModalWrapper from '@components/modals/core/components/ModalWrapper'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { toast } from 'react-toastify'

import Index from './index'
import FormModal from './index'
import { FormFieldConfig } from './typescript/modal_interfaces'

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
    const [data, setData] = useState({
      name: '',
      icon: '',
      color: ''
    })

    const FIELDS: FormFieldConfig<typeof data> = {
      name: {
        label: 'Name',
        type: 'text',
        required: true,
        placeholder: 'Name',
        icon: 'tabler:text-caption'
      },
      icon: {
        label: 'Icon',
        type: 'icon',
        required: true
      },
      color: {
        label: 'Color',
        type: 'color',
        required: true
      }
    }

    return (
      <ModalWrapper isOpen={true}>
        <FormModal
          {...args}
          form={{
            fields: FIELDS,
            data,
            setData,
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
