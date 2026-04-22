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
    icon: 'tabler:calendar',
    label: 'Date',
    onChange: () => {},
    value: new Date()
  },
  render: args => {
    const [date, setDate] = useState(args.value)

    return (
      <DateInput {...args} value={date} onChange={setDate} />
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
    hasTime: true,
    icon: 'tabler:clock',
    label: 'Date',
    onChange: () => {},
    value: new Date()
  },

  render: args => {
    const [date, setDate] = useState(args.value)

    return (
      <DateInput {...args} value={date} onChange={setDate} />
    )
  }
}

export const Required: Story = {
  args: {
    icon: 'tabler:calendar',
    label: 'Date',
    onChange: () => {},
    required: true,
    value: new Date()
  },

  render: args => {
    const [date, setDate] = useState(args.value)

    return (
      <DateInput {...args} value={date} onChange={setDate} />
    )
  }
}

export const Disabled: Story = {
  args: {
    icon: 'tabler:calendar',
    label: 'Date',
    onChange: () => {},
    value: new Date()
  },
  render: args => {
    const [date, setDate] = useState(args.value)

    return (
      <DateInput {...args} disabled value={date} onChange={setDate} />
    )
  }
}

export const WithErrorMessage: Story = {
  args: {
    errorMsg: 'Invalid date provided',
    icon: 'tabler:calendar',
    label: 'Date',
    onChange: () => {},
    value: new Date()
  },

  render: args => {
    const [date, setDate] = useState(args.value)

    return (
      <DateInput {...args} value={date} onChange={setDate} />
    )
  }
}

export const DisabledWithErrorMessage: Story = {
  args: {
    disabled: true,
    errorMsg: 'Invalid date provided',
    icon: 'tabler:calendar',
    label: 'Date',
    onChange: () => {},
    value: new Date()
  },
  render: args => {
    const [date, setDate] = useState(args.value)

    return (
      <DateInput {...args} disabled value={date} onChange={setDate} />
    )
  }
}

export const PlainVariant: Story = {
  args: {
    icon: 'tabler:calendar',
    label: 'Date',
    onChange: () => {},
    value: new Date(),
    variant: 'plain'
  },

  render: args => {
    const [date, setDate] = useState(args.value)

    return (
      <DateInput {...args} value={date} onChange={setDate} />
    )
  }
}

export const PlainVariantWithErrorMessage: Story = {
  args: {
    errorMsg: 'Invalid date provided',
    icon: 'tabler:calendar',
    label: 'Date',
    onChange: () => {},
    value: new Date(),
    variant: 'plain'
  },

  render: args => {
    const [date, setDate] = useState(args.value)

    return (
      <DateInput {...args} value={date} onChange={setDate} />
    )
  }
}
