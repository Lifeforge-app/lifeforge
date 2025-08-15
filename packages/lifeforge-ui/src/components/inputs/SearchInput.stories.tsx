import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import SearchInput from './SearchInput'

const meta = {
  component: SearchInput
} satisfies Meta<typeof SearchInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: '',
    setValue: () => {},
    searchTarget: 'something'
  },
  render: args => {
    const [value, setValue] = useState('')

    return (
      <div className="w-full px-32">
        <SearchInput {...args} setValue={setValue} value={value} />
      </div>
    )
  }
}

/**
 * SearchInput component with a custom icon.
 */
export const CustomIcon: Story = {
  args: {
    value: '',
    setValue: () => {},
    searchTarget: 'something',
    icon: 'tabler:cube'
  },

  render: args => (
    <div className="w-full px-32">
      <SearchInput {...args} />
    </div>
  )
}

/**
 * SearchInput component with an action button at the right end.
 */
export const WithActionButton: Story = {
  args: {
    value: '',
    setValue: () => {},
    searchTarget: 'something',
    actionButtonProps: {
      variant: 'plain',
      onClick: () => {},
      icon: 'tabler:filter'
    }
  },
  render: args => {
    const [value, setValue] = useState('')

    return (
      <div className="w-full px-32">
        <SearchInput {...args} setValue={setValue} value={value} />
      </div>
    )
  }
}
