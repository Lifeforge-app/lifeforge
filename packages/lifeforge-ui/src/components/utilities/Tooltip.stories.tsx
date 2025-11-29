import { Icon } from '@iconify/react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import Tooltip from './Tooltip'

const meta = {
  component: Tooltip,
  argTypes: {
    children: {
      control: false
    }
  }
} satisfies Meta<typeof Tooltip>

export default meta

type Story = StoryObj<typeof meta>

/**
 * A simple tooltip with informational content.
 */
export const Default: Story = {
  args: {
    id: 'info-tooltip',
    icon: 'tabler:info-circle',
    children: 'This is helpful information for the user.'
  },
  render: args => (
    <div className="flex-center h-full w-full">
      <div className="flex items-center gap-2">
        <span>Hover over the icon</span>
        <Tooltip {...args} />
      </div>
    </div>
  )
}

/**
 * A tooltip with clickable content.
 */
export const ClickableTooltip: Story = {
  args: {
    id: 'help-tooltip',
    icon: 'tabler:question-circle',
    children: (
      <>
        Visit{' '}
        <a
          className="text-custom-500 hover:text-custom-600 underline transition-all"
          href="https://docs.lifeforge.dev"
          rel="noreferrer"
          target="_blank"
        >
          Lifeforge Docs
        </a>{' '}
        to learn more about this project.
      </>
    )
  },
  render: args => (
    <div className="flex-center h-full w-full">
      <div className="flex items-center gap-2">
        <span>Need help?</span>
        <Tooltip {...args} clickable />
      </div>
    </div>
  )
}

/**
 * A detailed tooltip with multiple lines of information.
 */
export const DetailedTooltip: Story = {
  args: {
    id: 'detailed-tooltip',
    icon: 'tabler:info-circle',
    children: (
      <div className="max-w-xs">
        <h1 className="text-bg-800 dark:text-bg-100 mb-4 flex items-center gap-2 text-lg font-semibold">
          <Icon className="size-5" icon="tabler:info-circle" />
          Detailed Information
        </h1>
        <p>This is a detailed tooltip with multiple lines of information.</p>
        <p className="mt-2">It can contain longer explanations and guides.</p>
      </div>
    )
  },
  render: args => (
    <div className="flex-center h-full w-full">
      <div className="flex items-center gap-2">
        <span>Hover for details</span>
        <Tooltip {...args} />
      </div>
    </div>
  )
}

export const OpenOnClick: Story = {
  args: {
    id: 'click-tooltip',
    icon: 'tabler:info-circle',
    children: 'This tooltip opens on click instead of hover.'
  },
  render: args => (
    <div className="flex-center h-full w-full">
      <div className="flex items-center gap-2">
        <span>Click the icon</span>
        <Tooltip {...args} openOnClick />
      </div>
    </div>
  )
}

export const ErrorTooltip: Story = {
  args: {
    id: 'error-tooltip',
    icon: 'tabler:alert-circle',
    iconClassName: 'text-red-500',
    children: (
      <>
        <h1 className="mb-2 flex items-center gap-2 text-lg font-semibold text-red-500">
          <Icon className="size-5" icon="tabler:alert-circle" />
          Error Details
        </h1>
        <p>An unexpected error has occurred while processing your request.</p>
        <p className="mt-2">
          Please try again later or contact support if the issue persists.
        </p>
      </>
    )
  },
  render: args => (
    <div className="flex-center h-48 w-full">
      <div className="flex items-center gap-2">
        <span>Error info</span>
        <Tooltip {...args} />
      </div>
    </div>
  )
}
