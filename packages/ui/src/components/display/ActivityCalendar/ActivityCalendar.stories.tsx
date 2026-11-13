import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Box } from '@/components/primitives'

import {
  type Activity,
  ActivityCalendar,
  type ActivityCalendarProps
} from './index'

const currentYear = new Date().getFullYear()

function generateData(year: number): Activity[] {
  const data: Activity[] = []
  const date = new Date(year, 0, 1)

  while (date.getFullYear() === year) {
    const isoDate = [
      date.getFullYear(),
      `${date.getMonth() + 1}`.padStart(2, '0'),
      `${date.getDate()}`.padStart(2, '0')
    ].join('-')

    const count = (date.getDate() * 7 + date.getMonth() * 3) % 11

    data.push({
      count,
      date: isoDate,
      level: Math.min(Math.floor(count / 3), 4)
    })

    date.setDate(date.getDate() + 1)
  }

  return data
}

function ControlledCalendar(
  props: Omit<ActivityCalendarProps, 'firstYear' | 'onYearChange' | 'year'>
) {
  const [year, setYear] = useState(currentYear)

  return (
    <ActivityCalendar
      {...props}
      firstYear={currentYear - 2}
      tooltipContent={activity =>
        `${activity.count} activities on ${activity.date}`
      }
      year={year}
      onYearChange={setYear}
    />
  )
}

const meta = {
  component: ActivityCalendar,
  title: 'DataDisplay/ActivityCalendar'
} satisfies Meta<typeof ActivityCalendar>

export default meta

type Story = StoryObj<typeof meta>

/**
 * An activity calendar with the built-in year picker.
 */
export const Default: Story = {
  args: {
    data: generateData(currentYear),
    labels: {
      totalCount: '{{count}} activities in {{year}}'
    }
  },
  render: args => <ControlledCalendar {...args} />
}

/**
 * An activity calendar without the year picker, using a custom accent colour
 * and hiding the colour legend and total count.
 */
export const Compact: Story = {
  args: {
    accentColor: 'rgb(239 68 68)',
    data: generateData(currentYear),
    hideColorLegend: true,
    hideTotalCount: true
  }
}

/**
 * The empty state shown when there is no activity data.
 */
export const Empty: Story = {
  args: {
    data: [],
    emptyMessage: {
      description: 'Start tracking your activity to see it here.',
      title: 'No activities yet'
    }
  },
  render: args => (
    <Box height="15rem">
      <ActivityCalendar {...args} />
    </Box>
  )
}
