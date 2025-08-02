import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import DateInput from '.'

const meta = {
  component: DateInput
} satisfies Meta<typeof DateInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: new Date(),
    setValue: () => {},
    label: 'Date',
    icon: 'tabler:calendar',
    namespace: false
  },
  render: args => {
    const [date, setDate] = useState(args.value)

    return <DateInput {...args} setValue={setDate} value={date} />
  }
}
