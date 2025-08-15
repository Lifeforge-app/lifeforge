import ModalWrapper from '@components/modals/core/components/ModalWrapper'
import type { Meta, StoryObj } from '@storybook/react-vite'

import defineForm from './formBuilder'
import Index from './index'
import FormModal from './index'

type CuteForm = {
  title: string
  subtitle: string
}

const meta = {
  component: Index
} satisfies Meta<typeof Index>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {} as never,
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
          children: 'Submit'
        }
      })
      .typesMap({
        title: 'text',
        subtitle: 'text'
      })
      .setupFields({
        title: {
          label: 'Title',
          icon: 'tabler:text-size',
          placeholder: 'Enter title'
        },
        subtitle: {
          label: 'Subtitle',
          icon: 'tabler:text-size',
          placeholder: 'Enter subtitle'
        }
      })
      .initialData({
        subtitle: ''
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
