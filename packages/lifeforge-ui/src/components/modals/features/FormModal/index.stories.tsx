import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import ModalWrapper from '@components/modals/core/components/ModalWrapper'

import Index from './index'
import FormModal from './index'

const meta = {
  component: Index
} satisfies Meta<typeof Index>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    fields: [],
    title: 'Some Form',
    icon: 'tabler:list',
    onClose: () => {},
    namespace: 'namespace',
    data: {},
    setData: () => {}
  },
  render: args => {
    const [data, setData] = useState({
      name: '',
      icon: '',
      color: ''
    })

    return (
      <ModalWrapper isOpen={true}>
        <FormModal
          {...args}
          data={data}
          fields={[
            {
              id: 'name',
              label: 'Name',
              type: 'text',
              required: true,
              placeholder: 'Name',
              icon: 'tabler:text-caption'
            },
            {
              id: 'icon',
              label: 'Icon',
              type: 'icon',
              required: true
            },
            {
              id: 'color',
              label: 'Color',
              type: 'color',
              required: true
            }
          ]}
          setData={setData}
        />
      </ModalWrapper>
    )
  }
}
