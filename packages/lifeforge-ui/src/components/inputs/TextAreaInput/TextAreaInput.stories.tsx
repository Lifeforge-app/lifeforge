import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Box } from '@components/primitives'

import TextAreaInput from './TextAreaInput'

const meta = {
  component: TextAreaInput
} satisfies Meta<typeof TextAreaInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'tabler:text-size',
    label: 'Description',
    placeholder: 'Something amazing about yourself...',
    value: '',
    onChange: () => {}
  },
  render: args => {
    const [value, onChange] = useState(args.value)

    return (
      <Box width="32rem">
        <TextAreaInput
          {...args}
          disabled={false}
          onChange={onChange}
          value={value}
        />
      </Box>
    )
  }
}

export const PlaintVariant: Story = {
  args: {
    icon: 'tabler:text-size',
    label: 'Description',
    placeholder: 'Something amazing about yourself...',
    value: '',
    variant: 'plain'
  },

  render: args => {
    const [value, onChange] = useState(args.value)

    return (
      <Box width="32rem">
        <TextAreaInput
          {...args}
          disabled={false}
          onChange={onChange}
          value={value}
        />
      </Box>
    )
  }
}
