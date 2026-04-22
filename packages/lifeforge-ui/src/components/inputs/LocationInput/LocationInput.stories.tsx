import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import LocationInput, { type Location } from './LocationInput'

const meta = {
  argTypes: {
    onChange: {
      control: false
    },
    value: {
      control: false
    }
  },
  component: LocationInput
} satisfies Meta<typeof LocationInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'tabler:map-pin',
    label: 'Location',
    namespace: 'namespace',
    onChange: () => {},
    value: null
  },
  render: args => {
    const [location, setLocation] = useState<Location | null>(null)

    return (
      <LocationInput {...args} value={location} onChange={setLocation} />
    )
  }
}

export const Required: Story = {
  args: {
    icon: 'tabler:map-pin',
    label: 'Location',
    namespace: 'namespace',
    onChange: () => {},
    required: true,
    value: null
  },
  render: args => {
    const [location, setLocation] = useState<Location | null>(null)

    return (
      <LocationInput {...args} value={location} onChange={setLocation} />
    )
  }
}

export const Disabled: Story = {
  args: {
    disabled: true,
    icon: 'tabler:map-pin',
    label: 'Location',
    namespace: 'namespace',
    onChange: () => {},
    value: null
  },
  render: args => {
    const [location, setLocation] = useState<Location | null>(null)

    return (
      <LocationInput {...args} value={location} onChange={setLocation} />
    )
  }
}

export const WithErrorMessage: Story = {
  args: {
    errorMsg: 'Invalid location',
    icon: 'tabler:map-pin',
    label: 'Location',
    namespace: 'namespace',
    onChange: () => {},
    value: null
  },
  render: args => {
    const [location, setLocation] = useState<Location | null>(null)

    return (
      <LocationInput {...args} value={location} onChange={setLocation} />
    )
  }
}

export const DisabledWithErrorMessage: Story = {
  args: {
    disabled: true,
    errorMsg: 'Invalid location',
    icon: 'tabler:map-pin',
    label: 'Location',
    namespace: 'namespace',
    onChange: () => {},
    value: null
  },
  render: args => {
    const [location, setLocation] = useState<Location | null>(null)

    return (
      <LocationInput {...args} value={location} onChange={setLocation} />
    )
  }
}

export const PlainVariant: Story = {
  args: {
    icon: 'tabler:map-pin',
    label: 'Location',
    onChange: () => {},
    value: null,
    variant: 'plain'
  },
  render: args => {
    const [location, setLocation] = useState<Location | null>(null)

    return (
      <LocationInput {...args} value={location} onChange={setLocation} />
    )
  }
}

export const PlainVariantWithErrorMessage: Story = {
  args: {
    errorMsg: 'Invalid location',
    icon: 'tabler:map-pin',
    label: 'Location',
    onChange: () => {},
    value: null,
    variant: 'plain'
  },
  render: args => {
    const [location, setLocation] = useState<Location | null>(null)

    return (
      <LocationInput {...args} value={location} onChange={setLocation} />
    )
  }
}
