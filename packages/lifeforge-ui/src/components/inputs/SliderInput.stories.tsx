import type { Meta, StoryObj } from '@storybook/react'
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
    namespace: false,
    value: 0,
    required: true,
    setValue: () => {}
  },
  render: args => {
    const [value, setValue] = useState(args.value)

    return (
      <div className="w-96">
        <SliderInput {...args} setValue={setValue} value={value} />
      </div>
    )
  }
}
