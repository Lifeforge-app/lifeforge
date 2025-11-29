import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { SearchInput } from '@components/controls'

import ViewModeSelector from './ViewModeSelector'

const meta = {
  component: ViewModeSelector,
  argTypes: {
    onModeChange: {
      control: false
    },
    options: {
      control: false
    }
  }
} satisfies Meta<typeof ViewModeSelector>

export default meta

type Story = StoryObj<typeof meta>

const VIEW_OPTIONS = [
  { value: 'list', icon: 'tabler:list' },
  { value: 'grid', icon: 'tabler:grid-dots' },
  { value: 'gallery', icon: 'tabler:layout-grid' }
] as const

/**
 * A view mode selector for switching between list, grid, and gallery views.
 */
export const Default: Story = {
  args: {
    currentMode: 'list',
    onModeChange: () => {},
    options: VIEW_OPTIONS
  },
  render: args => {
    const [viewMode, setViewMode] = useState<'list' | 'grid' | 'gallery'>(
      'list'
    )

    return (
      <div className="flex-center h-full w-full">
        <ViewModeSelector
          {...args}
          currentMode={viewMode}
          onModeChange={setViewMode}
        />
      </div>
    )
  }
}

/**
 * A view mode selector placed beside a search bar, which is a common use case.
 */
export const BesideSearchBar: Story = {
  args: {
    currentMode: 'list',
    onModeChange: () => {},
    options: VIEW_OPTIONS
  },
  render: args => {
    const [viewMode, setViewMode] = useState<'list' | 'grid' | 'gallery'>(
      'list'
    )

    const [searchValue, setSearchValue] = useState('')

    return (
      <div className="flex w-full items-center gap-2 px-24">
        <SearchInput
          searchTarget="stuff"
          value={searchValue}
          onChange={setSearchValue}
        />
        <ViewModeSelector
          {...args}
          className="hidden md:flex"
          currentMode={viewMode}
          onModeChange={setViewMode}
        />
      </div>
    )
  }
}
