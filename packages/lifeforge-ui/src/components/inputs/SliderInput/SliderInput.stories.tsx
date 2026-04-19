import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import SliderInput from './SliderInput'

const meta = {
  component: SliderInput
} satisfies Meta<typeof SliderInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'tabler:rotate',
    label: 'Slider Input',
    value: 0,
    onChange: () => {}
  },
  render: args => {
    const [value, onChange] = useState(args.value)

    return (
      <div className="w-48 sm:w-96">
        <SliderInput {...args} value={value} onChange={onChange} />
      </div>
    )
  }
}
