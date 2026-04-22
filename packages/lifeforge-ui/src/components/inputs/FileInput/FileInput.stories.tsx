import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import Index from './index'

const meta = {
  component: Index
} satisfies Meta<typeof Index>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    acceptedMimeTypes: {
      application: ['pdf'],
      image: ['jpeg', 'png']
    },
    file: null,
    icon: 'tabler:file',
    label: 'Upload Image',
    namespace: 'namespace',
    preview: null,
    setData: () => {}
  },
  render: args => {
    const [image, setImage] = useState<string | File | null>(null)

    const [preview, setPreview] = useState<string | null>(null)

    return (
      <Index
        {...args}
        enablePixabay
        file={image}
        preview={preview}
        setData={({ file, preview }) => {
          setImage(file)
          setPreview(preview)
        }}
      />
    )
  }
}

export const Disabled: Story = {
  args: {
    acceptedMimeTypes: {
      application: ['pdf'],
      image: ['jpeg', 'png']
    },
    file: null,
    icon: 'tabler:file',
    label: 'Upload Image',
    namespace: 'namespace',
    preview: null,
    setData: () => {}
  },
  render: args => {
    const [image, setImage] = useState<string | File | null>(null)

    const [preview, setPreview] = useState<string | null>(null)

    return (
      <Index
        {...args}
        disabled
        enablePixabay
        file={image}
        preview={preview}
        setData={({ file, preview }) => {
          setImage(file)
          setPreview(preview)
        }}
      />
    )
  }
}
