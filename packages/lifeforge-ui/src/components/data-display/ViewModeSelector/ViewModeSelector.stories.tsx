import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { SearchInput } from '@components/inputs'
import { Box, Flex } from '@components/primitives'

import Widget from '../Widget'
import ViewModeSelector from './ViewModeSelector'

const meta = {
  argTypes: {
    onModeChange: {
      control: false
    },
    options: {
      control: false
    }
  },
  component: ViewModeSelector
} satisfies Meta<typeof ViewModeSelector>

export default meta

type Story = StoryObj<typeof meta>

const VIEW_OPTIONS = [
  { icon: 'tabler:list', text: 'List', value: 'list' },
  { icon: 'tabler:grid-dots', text: 'Grid', value: 'grid' },
  { icon: 'tabler:layout-grid', text: 'Gallery', value: 'gallery' }
] as const

/**
 * A view mode selector for switching between list, grid, and gallery views.
 */
export const Default: Story = {
  args: {
    currentMode: 'list',
    onModeChange: () => {},
    options: VIEW_OPTIONS.map(({ icon, value }) => ({
      icon,
      value
    }))
  },
  render: args => {
    const [viewMode, setViewMode] = useState<'list' | 'grid' | 'gallery'>(
      'list'
    )

    return (
      <Flex align="center" height="full" justify="center" width="100%">
        <ViewModeSelector
          {...args}
          currentMode={viewMode}
          onModeChange={setViewMode}
        />
      </Flex>
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
      <Flex align="center" height="full" justify="center" width="100%">
        <ViewModeSelector
          {...args}
          currentMode={viewMode}
          onModeChange={setViewMode}
        />
      </Flex>
    )
  }
}

export const TextOnly: Story = {
  args: {
    currentMode: 'list',
    onModeChange: () => {},
    options: VIEW_OPTIONS.map(({ text, value }) => ({
      text,
      value
    }))
  },
  render: args => {
    const [viewMode, setViewMode] = useState<'list' | 'grid' | 'gallery'>(
      'list'
    )

    return (
      <Flex align="center" height="full" justify="center" width="100%">
        <ViewModeSelector
          {...args}
          currentMode={viewMode}
          onModeChange={setViewMode}
        />
      </Flex>
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
      <Flex align="center" gap="md" width="100%">
        <SearchInput
          searchTarget="stuff"
          value={searchValue}
          onChange={setSearchValue}
        />
        <Box
          display={{
            base: 'none',
            md: 'block'
          }}
        >
          <ViewModeSelector
            {...args}
            currentMode={viewMode}
            onModeChange={setViewMode}
          />
        </Box>
      </Flex>
    )
  }
}

export const InsideWidget: Story = {
  args: {
    currentMode: '1M',
    onModeChange: () => {},
    options: ['1W', '1M', '3M', 'YTD', '1Y', 'ALL'].map(item => ({
      text: item,
      value: item
    }))
  },
  render: args => {
    const [viewMode, setViewMode] = useState<
      '1W' | '1M' | '3M' | 'YTD' | '1Y' | 'ALL'
    >('1M')

    return (
      <Box height="50vh">
        <Widget
          actionComponent={
            <ViewModeSelector
              size="small"
              {...args}
              currentMode={viewMode}
              onModeChange={setViewMode}
            />
          }
          icon="tabler:chart-dots"
          title="A Chart Or Something"
        />
      </Box>
    )
  }
}
