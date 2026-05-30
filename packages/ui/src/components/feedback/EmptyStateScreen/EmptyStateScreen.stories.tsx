import type { Meta, StoryObj } from '@storybook/react-vite'

import { Box, Text } from '@/components/primitives'

import { EmptyStateScreen } from './index'

const meta = {
  argTypes: {
    CTAButtonProps: {
      control: false,
      table: {
        type: {
          summary: 'React.ComponentProps<typeof Button>'
        }
      }
    },
    icon: {
      control: false,
      table: {
        type: {
          summary: 'string | React.ReactElement'
        }
      }
    },
    message: {
      control: false,
      table: {
        type: {
          summary:
            '{ id: string; namespace?: string; tKey?: string } | { title: string; description?: string | React.ReactNode; tKey?: string }'
        }
      }
    }
  },
  component: EmptyStateScreen
} satisfies Meta<typeof EmptyStateScreen>

export default meta

type Story = StoryObj<typeof meta>

/**
 * An empty state screen with default size.
 */
export const Default: Story = {
  args: {
    icon: 'tabler:clipboard-off',
    message: {
      id: 'tasks',
      namespace: 'apps.todoList'
    }
  },
  render: args => (
    <Box height="24rem" width="100%">
      <EmptyStateScreen {...args} />
    </Box>
  )
}

/**
 * An empty state screen with custom title and description.
 */
export const CustomContent: Story = {
  args: {
    icon: 'tabler:search-off',
    message: {
      description: 'Try adjusting your filters or adding new items.',
      title: 'Nothing to see here'
    }
  },
  render: args => (
    <Box height="24rem" width="100%">
      <EmptyStateScreen {...args} />
    </Box>
  )
}

/**
 * An empty state screen without description.
 */
export const WithoutDescription: Story = {
  args: {
    icon: 'tabler:database-off',
    message: {
      title: 'No Data Available'
    }
  },
  render: args => (
    <Box height="24rem" width="100%">
      <EmptyStateScreen {...args} />
    </Box>
  )
}

/**
 * An empty state screen with a CTA button.
 */
export const WithCTAButton: Story = {
  args: {
    CTAButtonProps: {
      children: 'Create Project',
      icon: 'tabler:plus',
      onClick: () => alert('Create project clicked')
    },
    icon: 'tabler:folder-off',
    message: {
      id: 'projects',
      namespace: 'apps.projectManager'
    }
  },
  render: args => (
    <Box height="24rem" width="100%">
      <EmptyStateScreen {...args} />
    </Box>
  )
}

/**
 * A smaller empty state screen.
 */
export const Smaller: Story = {
  args: {
    icon: 'tabler:bell-off',
    message: {
      description: 'You are all caught up!',
      title: 'No Notifications'
    },
    smaller: true
  },
  render: args => (
    <Box height="24rem" width="100%">
      <EmptyStateScreen {...args} />
    </Box>
  )
}

/**
 * An empty state screen with custom React element icon.
 */
export const CustomIcon: Story = {
  args: {
    icon: <Text size="6xl">🎉</Text>,
    message: {
      description: 'You have completed all your tasks for today.',
      title: 'Congratulations!'
    }
  },
  render: args => (
    <Box height="24rem" width="100%">
      <EmptyStateScreen {...args} />
    </Box>
  )
}
