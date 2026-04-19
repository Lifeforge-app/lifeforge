import type { Meta, StoryObj } from '@storybook/react-vite'

import { Card } from '@components/layout'

import Scrollbar from './Scrollbar'

const meta = {
  component: Scrollbar,
  argTypes: {
    children: {
      control: false
    }
  }
} satisfies Meta<typeof Scrollbar>

export default meta

type Story = StoryObj<typeof meta>

/**
 * A scrollbar with large content that requires scrolling.
 */
export const Default: Story = {
  args: {
    children: <></>
  },
  render: args => (
    <div className="h-96 w-96">
      <Scrollbar {...args}>
        <div className="space-y-4">
          {Array.from({ length: 50 }, (_, i) => (
            <Card key={i}>Item {i + 1}</Card>
          ))}
        </div>
      </Scrollbar>
    </div>
  )
}

/**
 * A scrollbar without padding on the right.
 */
export const NoPaddingRight: Story = {
  args: {
    usePaddingRight: false,
    children: <></>
  },
  render: args => (
    <div className="h-96 w-96">
      <Scrollbar {...args}>
        <div className="space-y-4">
          {Array.from({ length: 30 }, (_, i) => (
            <Card key={i}>Item {i + 1}</Card>
          ))}
        </div>
      </Scrollbar>
    </div>
  )
}

/**
 * A scrollbar with minimal content (no scroll needed).
 */
export const MinimalContent: Story = {
  args: {
    children: <></>
  },
  render: args => (
    <div className="h-96 w-96">
      <Scrollbar {...args}>
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <Card key={i}>Item {i + 1}</Card>
          ))}
        </div>
      </Scrollbar>
    </div>
  )
}

export const WithoutAutoHide: Story = {
  args: {
    autoHide: false,
    children: <></>
  },
  render: args => (
    <div className="h-96 w-96">
      <Scrollbar {...args}>
        <div className="space-y-4">
          {Array.from({ length: 50 }, (_, i) => (
            <Card key={i}>Item {i + 1}</Card>
          ))}
        </div>
      </Scrollbar>
    </div>
  )
}
