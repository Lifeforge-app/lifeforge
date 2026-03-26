import type { Meta, StoryObj } from '@storybook/react-vite'

import { Box } from '@components/primitives'

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

export const Note: Story = {
  args: {
    type: 'note',
    children:
      'Useful information that users should be aware of, even when skimming content.'
  },
  render: args => (
    <Box p="xl" width="600px">
      <Alert {...args} />
    </Box>
  )
}

export const Warning: Story = {
  args: {
    type: 'warning',
    children:
      'Urgent info that needs immediate user attention to avoid problems.'
  },
  render: args => (
    <Box p="xl" width="600px">
      <Alert {...args} />
    </Box>
  )
}

export const Tip: Story = {
  args: {
    type: 'tip',
    children: 'Helpful advices for doing things better or more easily.'
  },
  render: args => (
    <Box p="xl" width="600px">
      <Alert {...args} />
    </Box>
  )
}

export const Caution: Story = {
  args: {
    type: 'caution',
    children: 'Advise about risks or negative outcomes of certain actions.'
  },
  render: args => (
    <Box p="xl" width="600px">
      <Alert {...args} />
    </Box>
  )
}

export const Important: Story = {
  args: {
    type: 'important',
    children: 'Key information that users need to know to achieve their goal.'
  },
  render: args => (
    <Box p="xl" width="600px">
      <Alert {...args} />
    </Box>
  )
}
