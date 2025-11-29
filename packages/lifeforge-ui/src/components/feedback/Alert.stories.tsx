import type { Meta, StoryObj } from '@storybook/react-vite'

import Alert from './Alert'

const meta = {
  component: Alert,
  argTypes: {
    children: {
      control: false
    }
  }
} satisfies Meta<typeof Alert>

export default meta

type Story = StoryObj<typeof meta>

/**
 * A notealert for informational content.
 */
export const Note: Story = {
  args: {
    type: 'note',
    children:
      'Useful information that users should be aware of, even when skimming content.'
  },
  render: args => (
    <div className="w-[600px] p-8">
      <Alert {...args} />
    </div>
  )
}

/**
 * A warningalert for important warnings.
 */
export const Warning: Story = {
  args: {
    type: 'warning',
    children:
      'Urgent info that needs immediate user attention to avoid problems.'
  },
  render: args => (
    <div className="w-[600px] p-8">
      <Alert {...args} />
    </div>
  )
}

/**
 * A tipalert for helpful advice.
 */
export const Tip: Story = {
  args: {
    type: 'tip',
    children: 'Helpful advices for doing things better or more easily.'
  },
  render: args => (
    <div className="w-[600px] p-8">
      <Alert {...args} />
    </div>
  )
}

/**
 * A cautionalert for advising about risks or negative outcomes.
 */
export const Caution: Story = {
  args: {
    type: 'caution',
    children: 'Advise about risks or negative outcomes of certain actions.'
  },
  render: args => (
    <div className="w-[600px] p-8">
      <Alert {...args} />
    </div>
  )
}

/**
 * Aalert for important information.
 */
export const Important: Story = {
  args: {
    type: 'important',
    children: 'Key information that users need to know to achieve their goal.'
  },
  render: args => (
    <div className="w-[600px] p-8">
      <Alert {...args} />
    </div>
  )
}
