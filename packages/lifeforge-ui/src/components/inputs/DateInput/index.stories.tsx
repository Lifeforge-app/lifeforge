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
    date: new Date(),
    setDate: () => {},
    name: 'Date',
    icon: 'tabler:calendar',
    namespace: false
  },
  render: args => {
    const [date, setDate] = useState(args.date)

    return <DateInput darker {...args} date={date} setDate={setDate} />
  }
}
