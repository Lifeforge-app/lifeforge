import type { Location } from '@components/modals/features/FormModal/typescript/form_interfaces'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import LocationInput from './LocationInput'

const meta = {
  component: LocationInput
} satisfies Meta<typeof LocationInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: null,
    setValue: () => {},
    namespace: 'namespace'
  },
  render: args => {
    const [location, setLocation] = useState<Location | null>(null)

    return (
      <div className="w-[50vw]">
        <LocationInput {...args} setValue={setLocation} value={location} />
      </div>
    )
  }
}
