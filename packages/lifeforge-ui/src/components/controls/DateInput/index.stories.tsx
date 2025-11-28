import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import DateInput from '.'

const meta = {
  component: DateInput
} satisfies Meta<typeof DateInput>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Default DateInput component.
 * <br/>
 * NOTE: The datepicker isn't displayed correctly due to how the Storybook docs page is styled. Please head to each individual story for proper rendering.
 */
export const Default: Story = {
  args: {
    value: new Date(),
    onChange: () => {},
    label: 'Date',
    icon: 'tabler:calendar'
  },
  render: args => {
    const [date, setDate] = useState(args.value)

    return <DateInput {...args} onChange={setDate} value={date} />
  }
}

/**
 * DateInput component with time selection enabled.
 * <br />
 * NOTE: The datepicker isn't displayed correctly due to how the Storybook docs page is styled. Please head to each individual story for proper rendering.
 */
export const WithTime: Story = {
  args: {
    value: new Date(),
    onChange: () => {},
    label: 'Date',
    icon: 'tabler:clock',
    hasTime: true
  },

  render: args => {
    const [date, setDate] = useState(args.value)

    return <DateInput {...args} onChange={setDate} value={date} />
  }
}
