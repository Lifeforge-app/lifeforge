import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Pagination } from './index'

const meta = {
  argTypes: {
    onPageChange: {
      control: false
    },
    page: {
      control: false
    },
    totalPages: {
      control: { min: 1, step: 1, type: 'number' }
    }
  },
  component: Pagination
} satisfies Meta<typeof Pagination>

export default meta

type Story = StoryObj<typeof meta>

/**
 * A pagination component with 10 pages.
 */
export const Default: Story = {
  args: {
    onPageChange: () => {},
    page: 1,
    totalPages: 10
  },
  render: args => {
    const [currentPage, setCurrentPage] = useState(1)

    return (
      <div className="flex-center h-full w-full">
        <Pagination
          {...args}
          page={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    )
  }
}

/**
 * A pagination component with few pages.
 */
export const FewPages: Story = {
  args: {
    onPageChange: () => {},
    page: 50,
    totalPages: 3
  },

  render: args => {
    const [currentPage, setCurrentPage] = useState(2)

    return (
      <div className="flex-center h-full w-full">
        <Pagination
          {...args}
          page={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    )
  }
}

/**
 * A pagination component with many pages.
 */
export const ManyPages: Story = {
  args: {
    onPageChange: () => {},
    page: 50,
    totalPages: 100
  },
  render: args => {
    const [currentPage, setCurrentPage] = useState(50)

    return (
      <div className="flex-center h-full w-full">
        <Pagination
          {...args}
          page={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    )
  }
}

/**
 * A pagination component on the first page.
 */
export const FirstPage: Story = {
  args: {
    onPageChange: () => {},
    page: 1,
    totalPages: 10
  },
  render: args => {
    const [currentPage, setCurrentPage] = useState(1)

    return (
      <div className="flex-center h-full w-full">
        <Pagination
          {...args}
          page={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    )
  }
}

/**
 * A pagination component on the last page.
 */
export const LastPage: Story = {
  args: {
    onPageChange: () => {},
    page: 10,
    totalPages: 10
  },
  render: args => {
    const [currentPage, setCurrentPage] = useState(10)

    return (
      <div className="flex-center h-full w-full">
        <Pagination
          {...args}
          page={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    )
  }
}
