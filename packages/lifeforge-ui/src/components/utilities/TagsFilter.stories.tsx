import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import colors from 'tailwindcss/colors'

import { Button } from '@components/controls'

import TagsFilter from './TagsFilter'

const meta = {
  component: TagsFilter,
  argTypes: {
    availableFilters: {
      control: false
    },
    values: {
      control: false,
      table: {
        type: {
          summary: 'Record<string, string | string[] | null>'
        }
      }
    },
    onChange: {
      control: false,
      table: {
        type: {
          summary: 'Record<string, (value: string | string[] | null) => void>'
        }
      }
    }
  }
} satisfies Meta<typeof TagsFilter>

export default meta

type Story = StoryObj<typeof meta>

const CATEGORIES = [
  {
    id: 'work',
    name: 'Work',
    icon: 'tabler:briefcase',
    color: colors.blue[500]
  },
  {
    id: 'personal',
    name: 'Personal',
    icon: 'tabler:user',
    color: colors.green[500]
  },
  {
    id: 'urgent',
    name: 'Urgent',
    icon: 'tabler:alert-circle',
    color: colors.red[500]
  }
]

const STATUSES = [
  {
    id: 'active',
    name: 'Active',
    icon: 'tabler:check',
    color: colors.green[500]
  },
  {
    id: 'pending',
    name: 'Pending',
    icon: 'tabler:clock',
    color: colors.yellow[500]
  },
  {
    id: 'completed',
    name: 'Completed',
    icon: 'tabler:circle-check',
    color: colors.blue[500]
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
    values: { category: 'work' },
    onChange: {
      category: () => {}
    }
  },
  render: args => {
    const [category, setCategory] = useState<string | null>('work')

    return (
      <div className="w-[60vw]">
        <header className="flex-between mb-2 flex w-full">
          <div className="flex min-w-0 items-end">
            <h1 className="truncate text-2xl font-semibold lg:text-3xl">
              All Tasks
            </h1>
            <span className="text-bg-500 mr-8 ml-2 text-base">(87)</span>
          </div>
          <Button
            className="lg:hidden"
            icon="tabler:menu"
            variant="plain"
            onClick={() => {}}
          />
        </header>
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
    values: { category: 'work', status: 'active' },
    onChange: {
      category: () => {},
      status: () => {}
    }
  },
  render: args => {
    const [category, setCategory] = useState<string | null>('work')

    const [status, setStatus] = useState<string | null>('active')

    return (
      <div className="w-[60vw]">
        <header className="flex-between mb-2 flex w-full">
          <div className="flex min-w-0 items-end">
            <h1 className="truncate text-2xl font-semibold lg:text-3xl">
              All Tasks
            </h1>
            <span className="text-bg-500 mr-8 ml-2 text-base">(87)</span>
          </div>
          <Button
            className="lg:hidden"
            icon="tabler:menu"
            variant="plain"
            onClick={() => {}}
          />
        </header>
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
    values: { categories: ['work', 'personal'] },
    onChange: {
      categories: () => {}
    }
  },
  render: args => {
    const [categories, setCategories] = useState<string[] | null>([
      'work',
      'personal'
    ])

    return (
      <div className="w-[60vw]">
        <header className="flex-between mb-2 flex w-full">
          <div className="flex min-w-0 items-end">
            <h1 className="truncate text-2xl font-semibold lg:text-3xl">
              All Tasks
            </h1>
            <span className="text-bg-500 mr-8 ml-2 text-base">(87)</span>
          </div>
          <Button
            className="lg:hidden"
            icon="tabler:menu"
            variant="plain"
            onClick={() => {}}
          />
        </header>
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
    values: { categories: 'work' },
    onChange: {
      categories: () => {}
    }
  },
  render: args => {
    const [categories, setCategories] = useState<string | null>('work')

    return (
      <div className="w-[60vw]">
        <header className="flex-between mb-2 flex w-full">
          <div className="flex min-w-0 items-end">
            <h1 className="truncate text-2xl font-semibold lg:text-3xl">
              All Tasks
            </h1>
            <span className="text-bg-500 mr-8 ml-2 text-base">(87)</span>
          </div>
          <Button
            className="lg:hidden"
            icon="tabler:menu"
            variant="plain"
            onClick={() => {}}
          />
        </header>
        <TagsFilter
          {...args}
          values={{ categories }}
          onChange={{ categories: setCategories }}
        />
      </div>
    )
  }
}
