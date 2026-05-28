import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Button } from '@/components/inputs'
import { Box, Flex, Text } from '@/components/primitives'

import { TAILWIND_PALETTE } from '@/system'

import { TagsFilter } from './index'

const meta = {
  argTypes: {
    availableFilters: {
      control: false
    },
    onChange: {
      control: false,
      table: {
        type: {
          summary: 'Record<string, (value: string | string[] | null) => void>'
        }
      }
    },
    values: {
      control: false,
      table: {
        type: {
          summary: 'Record<string, string | string[] | null>'
        }
      }
    }
  },
  component: TagsFilter
} satisfies Meta<typeof TagsFilter>

export default meta

type Story = StoryObj<typeof meta>

const CATEGORIES = [
  {
    color: TAILWIND_PALETTE.blue[500],
    icon: 'tabler:briefcase',
    id: 'work',
    label: 'Work'
  },
  {
    color: TAILWIND_PALETTE.green[500],
    icon: 'tabler:user',
    id: 'personal',
    label: 'Personal'
  },
  {
    color: TAILWIND_PALETTE.red[500],
    icon: 'tabler:alert-circle',
    id: 'urgent',
    label: 'Urgent'
  }
]

const STATUSES = [
  {
    color: TAILWIND_PALETTE.green[500],
    icon: 'tabler:check',
    id: 'active',
    label: 'Active'
  },
  {
    color: TAILWIND_PALETTE.yellow[500],
    icon: 'tabler:clock',
    id: 'pending',
    label: 'Pending'
  },
  {
    color: TAILWIND_PALETTE.blue[500],
    icon: 'tabler:circle-check',
    id: 'completed',
    label: 'Completed'
  }
]

/**
 * A tags filter with a single selected category.
 */
export const SingleFilter: Story = {
  args: {
    availableFilters: {
      category: { data: CATEGORIES, isColored: true }
    },
    onChange: {
      category: () => {}
    },
    values: { category: 'work' }
  },
  render: args => {
    const [category, setCategory] = useState<string | null>('work')

    return (
      <div style={{ width: '60vw' }}>
        <Flex as="header" justify="between" mb="md">
          <Flex align="end" minWidth="0">
            <Text
              truncate
              as="h1"
              size={{
                base: '2xl',
                lg: '3xl'
              }}
              weight="semibold"
            >
              All Tasks
            </Text>
            <Text color="muted" ml="sm">
              (87)
            </Text>
          </Flex>
          <Box
            display={{
              base: 'block',
              lg: 'none'
            }}
          >
            <Button icon="tabler:menu" variant="plain" onClick={() => {}} />
          </Box>
        </Flex>
        <TagsFilter
          {...args}
          values={{ category }}
          onChange={{ category: setCategory }}
        />
      </div>
    )
  }
}

/**
 * A tags filter with multiple selected categories.
 */
export const MultipleFilters: Story = {
  args: {
    availableFilters: {
      category: { data: CATEGORIES, isColored: true },
      status: { data: STATUSES, isColored: true }
    },
    onChange: {
      category: () => {},
      status: () => {}
    },
    values: { category: 'work', status: 'active' }
  },
  render: args => {
    const [category, setCategory] = useState<string | null>('work')

    const [status, setStatus] = useState<string | null>('active')

    return (
      <div style={{ width: '60vw' }}>
        <Flex as="header" justify="between" mb="md">
          <Flex align="end" minWidth="0">
            <Text
              truncate
              as="h1"
              size={{ base: '2xl', lg: '3xl' }}
              weight="semibold"
            >
              All Tasks
            </Text>
            <Text color="muted" ml="sm">
              (87)
            </Text>
          </Flex>
          <Box display={{ base: 'block', lg: 'none' }}>
            <Button icon="tabler:menu" variant="plain" onClick={() => {}} />
          </Box>
        </Flex>
        <TagsFilter
          {...args}
          values={{ category, status }}
          onChange={{ category: setCategory, status: setStatus }}
        />
      </div>
    )
  }
}

/**
 * A tags filter with array of selected values.
 */
export const ArrayFilters: Story = {
  args: {
    availableFilters: {
      categories: { data: CATEGORIES, isColored: true }
    },
    onChange: {
      categories: () => {}
    },
    values: { categories: ['work', 'personal'] }
  },
  render: args => {
    const [categories, setCategories] = useState<string[] | null>([
      'work',
      'personal'
    ])

    return (
      <div style={{ width: '60vw' }}>
        <Flex as="header" justify="between" mb="md">
          <Flex align="end" minWidth="0">
            <Text
              truncate
              as="h1"
              size={{ base: '2xl', lg: '3xl' }}
              weight="semibold"
            >
              All Tasks
            </Text>
            <Text color="muted" ml="sm">
              (87)
            </Text>
          </Flex>
          <Box display={{ base: 'block', lg: 'none' }}>
            <Button icon="tabler:menu" variant="plain" onClick={() => {}} />
          </Box>
        </Flex>
        <TagsFilter
          {...args}
          values={{ categories }}
          onChange={{ categories: setCategories }}
        />
      </div>
    )
  }
}

/**
 * A tags filter with uncolored tags.
 */
export const Uncolored: Story = {
  args: {
    availableFilters: {
      categories: { data: CATEGORIES, isColored: false }
    },
    onChange: {
      categories: () => {}
    },
    values: { categories: 'work' }
  },
  render: args => {
    const [categories, setCategories] = useState<string | null>('work')

    return (
      <div style={{ width: '60vw' }}>
        <Flex as="header" justify="between" mb="md">
          <Flex align="end" minWidth="0">
            <Text
              truncate
              as="h1"
              size={{ base: '2xl', lg: '3xl' }}
              weight="semibold"
            >
              All Tasks
            </Text>
            <Text color="muted" ml="sm">
              (87)
            </Text>
          </Flex>
          <Box display={{ base: 'block', lg: 'none' }}>
            <Button icon="tabler:menu" variant="plain" onClick={() => {}} />
          </Box>
        </Flex>
        <TagsFilter
          {...args}
          values={{ categories }}
          onChange={{ categories: setCategories }}
        />
      </div>
    )
  }
}
