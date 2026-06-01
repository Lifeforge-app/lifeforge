import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { FileInput } from './index'
import type { FileValue } from './index'

const meta = {
  component: FileInput
} satisfies Meta<typeof FileInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    mimeTypes: {
      application: ['pdf'],
      image: ['jpeg', 'png']
    },
    value: { type: 'empty' },
    icon: 'tabler:file',
    label: 'Upload Image',
    namespace: 'namespace',
    onChange: function () {}
  },
  render: function (args) {
    const [val, setVal] = useState<FileValue>({ type: 'empty' })

    return (
      <FileInput
        {...args}
        value={val}
        onChange={setVal}
      />
    )
  }
}

export const Disabled: Story = {
  args: {
    mimeTypes: {
      application: ['pdf'],
      image: ['jpeg', 'png']
    },
    value: { type: 'empty' },
    icon: 'tabler:file',
    label: 'Upload Image',
    namespace: 'namespace',
    onChange: function () {}
  },
  render: function (args) {
    const [val, setVal] = useState<FileValue>({ type: 'empty' })

    return (
      <FileInput
        {...args}
        disabled
        value={val}
        onChange={setVal}
      />
    )
  }
}
