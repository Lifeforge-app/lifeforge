import { Location } from '@components/modals/features/FormModal/typescript/form_interfaces'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import LocationInput from './LocationInput'

const meta = {
  component: LocationInput
} satisfies Meta<typeof LocationInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    location: null,
    setLocation: () => {},
    namespace: 'namespace'
  },
  render: args => {
    const [location, setLocation] = useState<Location | null>(null)

    return (
      <div className="w-[50vw]">
        <LocationInput
          {...args}
          location={location}
          setLocation={setLocation}
        />
      </div>
    )
  }
}
