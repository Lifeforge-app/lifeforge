import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { FileInput } from './index'
import type { FileValue } from './index'

const meta = {
  component: FileInput,
  title: 'Inputs/FileInput'
} satisfies Meta<typeof FileInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'tabler:file',
    label: 'Upload Image',
    mimeTypes: {
      application: ['pdf'],
      image: ['jpeg', 'png']
    },
    namespace: 'namespace',
    onChange: function () {},
    value: { type: 'empty' }
  },
  render: function (args) {
    const [val, setVal] = useState<FileValue>({ type: 'empty' })

    return <FileInput {...args} value={val} onChange={setVal} />
  }
}

export const Disabled: Story = {
  args: {
    icon: 'tabler:file',
    label: 'Upload Image',
    mimeTypes: {
      application: ['pdf'],
      image: ['jpeg', 'png']
    },
    namespace: 'namespace',
    onChange: function () {},
    value: { type: 'empty' }
  },
  render: function (args) {
    const [val, setVal] = useState<FileValue>({ type: 'empty' })

    return <FileInput {...args} disabled value={val} onChange={setVal} />
  }
}

export const WithError: Story = {
  args: {
    errorMsg: 'File is required and must be an image',
    icon: 'tabler:file',
    label: 'Upload Image',
    mimeTypes: {
      application: ['pdf'],
      image: ['jpeg', 'png']
    },
    namespace: 'namespace',
    onChange: function () {},
    value: { type: 'empty' }
  },
  render: function (args) {
    const [val, setVal] = useState<FileValue>({ type: 'empty' })

    return <FileInput {...args} value={val} onChange={setVal} />
  }
}
