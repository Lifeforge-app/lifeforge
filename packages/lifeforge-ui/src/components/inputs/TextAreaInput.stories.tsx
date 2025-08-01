import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import TextAreaInput from './TextAreaInput'

const meta = {
  component: TextAreaInput
} satisfies Meta<typeof TextAreaInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'tabler:text-size',
    name: 'Description',
    placeholder: 'Something amazing about yourself...',
    value: '',
    setValue: () => {},
    namespace: false,
    darker: true
  },
  render: args => {
    const [value, setValue] = useState(args.value)

    return (
      <TextAreaInput
        {...args}
        className="w-128"
        disabled={false}
        setValue={setValue}
        value={value}
      />
    )
  }
}
