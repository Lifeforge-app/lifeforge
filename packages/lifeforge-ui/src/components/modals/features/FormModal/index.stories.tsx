import ModalWrapper from '@components/modals/core/components/ModalWrapper'
import type { Meta, StoryObj } from '@storybook/react-vite'

import Index from './index'
import FormModal from './index'
import defineForm from './utils/FormBuilder'

type CuteForm = {
  title: string
  rrule: string
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
        title: 'text',
        rrule: 'rrule'
      })
      .setupFields({
        rrule: {
          hasDuration: true,
          label: 'Recurrence Rule'
        }
      })
      .initialData({
        rrule: ''
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
