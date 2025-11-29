import type { Meta, StoryObj } from '@storybook/react-vite'

import EmptyStateScreen from './EmptyStateScreen'

const meta = {
  component: EmptyStateScreen,
  argTypes: {
    CTAButtonProps: {
      control: false,
      table: {
        type: {
          summary: 'React.ComponentProps<typeof Button>'
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
    },
    icon: {
      control: false,
      table: {
        type: {
          summary: 'string | React.ReactElement'
        }
      }
    }
  }
} satisfies Meta<typeof EmptyStateScreen>

export default meta

type Story = StoryObj<typeof meta>

/**
 * An empty state screen with default size.
 */
export const Default: Story = {
  args: {
    message: {
      id: 'tasks',
      namespace: 'apps.todoList'
    },
    icon: 'tabler:clipboard-off'
  },
  render: args => (
    <div className="h-96 w-full">
      <EmptyStateScreen {...args} />
    </div>
  )
}

/**
 * An empty state screen with custom title and description.
 */
export const CustomContent: Story = {
  args: {
    message: {
      title: 'Nothing to see here',
      description: 'Try adjusting your filters or adding new items.'
    },
    icon: 'tabler:search-off'
  },
  render: args => (
    <div className="h-96 w-full">
      <EmptyStateScreen {...args} />
    </div>
  )
}

/**
 * An empty state screen without description.
 */
export const WithoutDescription: Story = {
  args: {
    message: {
      title: 'No Data Available'
    },
    icon: 'tabler:database-off'
  },
  render: args => (
    <div className="h-96 w-full">
      <EmptyStateScreen {...args} />
    </div>
  )
}

/**
 * An empty state screen with a CTA button.
 */
export const WithCTAButton: Story = {
  args: {
    message: {
      id: 'projects',
      namespace: 'apps.projectManager'
    },
    icon: 'tabler:folder-off',
    CTAButtonProps: {
      children: 'Create Project',
      icon: 'tabler:plus',
      onClick: () => alert('Create project clicked')
    }
  },
  render: args => (
    <div className="h-96 w-full">
      <EmptyStateScreen {...args} />
    </div>
  )
}

/**
 * A smaller empty state screen.
 */
export const Smaller: Story = {
  args: {
    message: {
      title: 'No Notifications',
      description: 'You are all caught up!'
    },
    icon: 'tabler:bell-off',
    smaller: true
  },
  render: args => (
    <div className="h-96 w-full">
      <EmptyStateScreen {...args} />
    </div>
  )
}

/**
 * An empty state screen with custom React element icon.
 */
export const CustomIcon: Story = {
  args: {
    message: {
      title: 'Congratulations!',
      description: 'You have completed all your tasks for today.'
    },
    icon: <span className="text-6xl">🎉</span>
  },
  render: args => (
    <div className="h-96 w-full">
      <EmptyStateScreen {...args} />
    </div>
  )
}
