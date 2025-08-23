import type { Meta, StoryObj } from '@storybook/react-vite'

import DashboardItem from './DashboardItem'

const meta = {
  component: DashboardItem
} satisfies Meta<typeof DashboardItem>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'tabler:cube',
    title: 'Dashboard Item Very Cool',
    className: 'w-[80vw] h-[80vh]'
  },
  render: args => (
    <div className="flex-center h-full w-full">
      <DashboardItem {...args}>Content</DashboardItem>
    </div>
  )
}
