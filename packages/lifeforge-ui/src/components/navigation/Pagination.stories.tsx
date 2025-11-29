import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import Pagination from './Pagination'

const meta = {
  component: Pagination,
  argTypes: {
    page: {
      control: false
    },
    totalPages: {
      control: { type: 'number', min: 1, step: 1 }
    },
    onPageChange: {
      control: false
    }
  }
} satisfies Meta<typeof Pagination>

export default meta

type Story = StoryObj<typeof meta>

/**
 * A pagination component with 10 pages.
 */
export const Default: Story = {
  args: {
    totalPages: 10,
    page: 1,
    onPageChange: () => {}
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
 * A pagination component with many pages.
 */
export const ManyPages: Story = {
  args: {
    totalPages: 100,
    page: 50,
    onPageChange: () => {}
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
    totalPages: 10,
    page: 1,
    onPageChange: () => {}
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
    totalPages: 10,
    page: 10,
    onPageChange: () => {}
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
