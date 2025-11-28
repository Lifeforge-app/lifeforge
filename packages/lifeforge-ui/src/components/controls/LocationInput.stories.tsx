import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import LocationInput, { type Location } from './LocationInput'

const meta = {
  component: LocationInput
} satisfies Meta<typeof LocationInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: null,
    onChange: () => {},
    namespace: 'namespace'
  },
  render: args => {
    const [location, setLocation] = useState<Location | null>(null)

    return (
      <div className="w-[50vw]">
        <LocationInput {...args} onChange={setLocation} value={location} />
      </div>
    )
  }
}
