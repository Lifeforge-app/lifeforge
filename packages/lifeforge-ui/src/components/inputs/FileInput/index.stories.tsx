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
    icon: 'tabler:file',
    label: 'Upload Image',
    file: null,
    preview: null,
    setData: () => {},
    namespace: 'namespace',
    acceptedMimeTypes: {
      image: ['jpeg']
    }
  },
  render: args => {
    const [image, setImage] = useState<string | File | null>(null)

    const [preview, setPreview] = useState<string | null>(null)

    return (
      <div className="flex h-screen w-screen items-center justify-center px-32">
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
      </div>
    )
  }
}
