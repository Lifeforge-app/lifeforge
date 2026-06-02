import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { TagsInput } from './index'

const meta = {
  component: TagsInput,
  title: 'Inputs/TagsInput'
} satisfies Meta<typeof TagsInput>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Default TagsInput component.
 */
export const Default: Story = {
  args: {
    icon: 'tabler:tags',
    label: 'Labels',
    onChange: () => {},
    placeholder: 'placeholder',
    value: [],
    variant: 'classic'
  },
  render: args => {
    const [value, onChange] = useState<string[]>([])

    return <TagsInput {...args} value={value} onChange={onChange} />
  }
}

/**
 * TagsInput component with an action button at the right hand side
 */
export const WithActionButton: Story = {
  args: {
    actionButtonProps: {
      icon: 'mage:stars-c',
      onClick: () => {
        alert('Action button clicked!')
      }
    },
    icon: 'tabler:tags',
    label: 'Labels',
    onChange: () => {},
    placeholder: 'placeholder',
    value: []
  },
  render: args => {
    const [value, onChange] = useState<string[]>([])

    return <TagsInput {...args} value={value} onChange={onChange} />
  }
}

export const Required: Story = {
  args: {
    icon: 'tabler:tags',
    label: 'Labels',
    onChange: () => {},
    placeholder: 'placeholder',
    required: true,
    value: []
  },
  render: args => {
    const [value, onChange] = useState<string[]>([])

    return <TagsInput {...args} value={value} onChange={onChange} />
  }
}

export const Disabled: Story = {
  args: {
    icon: 'tabler:tags',
    label: 'Labels',
    onChange: () => {},
    placeholder: 'placeholder',
    value: [],
    variant: 'classic'
  },
  render: args => {
    const [value, onChange] = useState<string[]>([])

    return <TagsInput {...args} disabled value={value} onChange={onChange} />
  }
}

export const WithErrorMessage: Story = {
  args: {
    errorMsg: 'Too much tags provided',
    icon: 'tabler:tags',
    label: 'Labels',
    onChange: () => {},
    placeholder: 'placeholder',
    value: []
  },

  render: args => {
    const [value, onChange] = useState<string[]>([])

    return <TagsInput {...args} value={value} onChange={onChange} />
  }
}

export const DisabledWithErrorMessage: Story = {
  args: {
    disabled: true,
    errorMsg: 'Too much tags provided',
    icon: 'tabler:tags',
    label: 'Labels',
    onChange: () => {},
    placeholder: 'placeholder',
    value: []
  },

  render: args => {
    const [value, onChange] = useState<string[]>([])

    return <TagsInput {...args} disabled value={value} onChange={onChange} />
  }
}

export const PlainVariant: Story = {
  args: {
    icon: 'tabler:tags',
    label: 'Labels',
    onChange: () => {},
    placeholder: 'placeholder',
    value: [],
    variant: 'plain'
  },

  render: args => {
    const [value, onChange] = useState<string[]>([])

    return <TagsInput {...args} value={value} onChange={onChange} />
  }
}

export const PlainVariantWithErrorMessage: Story = {
  args: {
    errorMsg: 'Too much tags provided',
    icon: 'tabler:tags',
    label: 'Labels',
    onChange: () => {},
    placeholder: 'placeholder',
    value: [],
    variant: 'plain'
  },

  render: args => {
    const [value, onChange] = useState<string[]>([])

    return <TagsInput {...args} value={value} onChange={onChange} />
  }
}
