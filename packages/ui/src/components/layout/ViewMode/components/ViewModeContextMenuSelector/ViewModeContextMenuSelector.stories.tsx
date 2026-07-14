import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { ContextMenu } from '@/components/overlays'
import { Flex } from '@/components/primitives'

import { ViewModeContextMenuSelector } from './index'

const meta = {
  argTypes: {
    modes: {
      control: false
    },
    onModeChange: {
      control: false
    }
  },
  component: ViewModeContextMenuSelector,
  title: 'DataDisplay/ViewModeContextMenuSelector'
} satisfies Meta<typeof ViewModeContextMenuSelector>

export default meta

type Story = StoryObj<typeof meta>

const VIEW_OPTIONS = [
  { icon: 'tabler:list', text: 'List', value: 'list' },
  { icon: 'tabler:grid-dots', text: 'Grid', value: 'grid' },
  { icon: 'tabler:layout-grid', text: 'Gallery', value: 'gallery' }
] as const

/**
 * A context menu selector for switching between view modes. Useful for compact
 * layouts where the button-based selector takes too much space.
 */
export const Default: Story = {
  args: {
    currentMode: 'list',
    modes: VIEW_OPTIONS.map(({ icon, value }) => ({
      icon,
      value
    })),
    namespace: false,
    onModeChange: () => {}
  },
  render: args => {
    const [viewMode, setViewMode] = useState<'list' | 'grid' | 'gallery'>(
      'list'
    )

    return (
      <Flex align="center" height="full" justify="center" width="100%">
        <ContextMenu>
          <ViewModeContextMenuSelector
            {...args}
            currentMode={viewMode}
            onModeChange={setViewMode}
          />
        </ContextMenu>
      </Flex>
    )
  }
}

/**
 * Using the context menu selector with text labels on items instead of icons.
 */
export const TextOnly: Story = {
  args: {
    currentMode: 'list',
    modes: VIEW_OPTIONS.map(({ text, value }) => ({
      text,
      value
    })),
    namespace: '',
    onModeChange: () => {}
  },
  render: args => {
    const [viewMode, setViewMode] = useState<'list' | 'grid' | 'gallery'>(
      'list'
    )

    return (
      <Flex align="center" height="full" justify="center" width="100%">
        <ContextMenu>
          <ViewModeContextMenuSelector
            {...args}
            currentMode={viewMode}
            onModeChange={setViewMode}
          />
        </ContextMenu>
      </Flex>
    )
  }
}
