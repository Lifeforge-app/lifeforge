import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import TagsInput from './TagsInput'

const meta = {
  component: TagsInput
} satisfies Meta<typeof TagsInput>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Default TagsInput component.
 */
export const Default: Story = {
  args: {
    label: 'Labels',
    icon: 'tabler:tags',
    placeholder: 'placeholder',
    value: [],
    setValue: () => {}
  },
  render: args => {
    const [value, setValue] = useState<string[]>([])

    return (
      <div className="w-full px-32">
        <TagsInput {...args} setValue={setValue} value={value} />
      </div>
    )
  }
}

/**
 * TagsInput component with an action button at the right hand side
 */
export const WithActionButton: Story = {
  args: {
    label: 'Labels',
    icon: 'tabler:tags',
    placeholder: 'placeholder',
    value: [],
    setValue: () => {},
    actionButtonProps: {
      icon: 'mage:stars-c'
    }
  },
  render: args => {
    const [value, setValue] = useState<string[]>([])

    return (
      <div className="w-full px-32">
        <TagsInput {...args} setValue={setValue} value={value} />
      </div>
    )
  }
}
