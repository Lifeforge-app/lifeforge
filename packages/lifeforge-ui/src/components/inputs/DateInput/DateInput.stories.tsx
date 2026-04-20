import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Box } from '@components/primitives'

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

    return (
      <Box p="2xl">
        <DateInput {...args} value={date} onChange={setDate} />
      </Box>
    )
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

    return (
      <Box>
        <DateInput {...args} value={date} onChange={setDate} />
      </Box>
    )
  }
}

export const Required: Story = {
  args: {
    value: new Date(),
    onChange: () => {},
    label: 'Date',
    icon: 'tabler:calendar',
    required: true,
    variant: 'classic'
  },

  render: args => {
    const [date, setDate] = useState(args.value)

    return (
      <Box p="2xl">
        <DateInput {...args} value={date} onChange={setDate} />
      </Box>
    )
  }
}

export const PlaintVariant: Story = {
  args: {
    value: '2026-04-20T00:29:27.683Z',
    label: 'Date',
    icon: 'tabler:calendar',
    required: true,
    variant: 'plain'
  },

  render: args => {
    const [date, setDate] = useState(args.value)

    return (
      <Box p="2xl">
        <DateInput {...args} value={date} onChange={setDate} />
      </Box>
    )
  }
}
