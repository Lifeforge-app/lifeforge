import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { SearchInput } from '@components/inputs'

import ViewModeSelector from './ViewModeSelector'
import Widget from './Widget'

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
  { value: 'list', icon: 'tabler:list', text: 'List' },
  { value: 'grid', icon: 'tabler:grid-dots', text: 'Grid' },
  { value: 'gallery', icon: 'tabler:layout-grid', text: 'Gallery' }
] as const

/**
 * A view mode selector for switching between list, grid, and gallery views.
 */
export const Default: Story = {
  args: {
    currentMode: 'list',
    onModeChange: () => {},
    options: VIEW_OPTIONS.map(({ value, icon }) => ({
      value,
      icon
    }))
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

export const WithText: Story = {
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

export const TextOnly: Story = {
  args: {
    currentMode: 'list',
    onModeChange: () => {},
    options: VIEW_OPTIONS.map(({ value, text }) => ({
      value,
      text
    }))
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

export const InsideWidget: Story = {
  args: {
    currentMode: '1M',
    onModeChange: () => {},
    options: ['1W', '1M', '3M', 'YTD', '1Y', 'ALL'].map(item => ({
      value: item,
      text: item
    }))
  },
  render: args => {
    const [viewMode, setViewMode] = useState<
      '1W' | '1M' | '3M' | 'YTD' | '1Y' | 'ALL'
    >('1M')

    return (
      <Widget
        actionComponent={
          <ViewModeSelector
            className="component-bg-lighter"
            size="small"
            {...args}
            currentMode={viewMode}
            onModeChange={setViewMode}
          />
        }
        icon="tabler:chart-dots"
        title="A Chart Or Something"
      ></Widget>
    )
  }
}
