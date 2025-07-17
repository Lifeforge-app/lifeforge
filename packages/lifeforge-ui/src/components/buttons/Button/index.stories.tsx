import type { Meta, StoryObj } from '@storybook/react'

import Index from './index'

const meta = {
  component: Index
} satisfies Meta<typeof Index>

export default meta

type Story = StoryObj<typeof meta>

export const PrimaryVariant: Story = {
  args: {
    as: 'button',
    icon: 'tabler:cube',
    children: 'Button',
    tProps: {}
  },
  render: props => <Index {...props} />
}

export const SecondaryVariant: Story = {
  args: {
    as: 'button',
    icon: 'tabler:cube',
    children: 'Secondary',
    tProps: {},
    variant: 'secondary'
  },

  render: props => <Index {...props} />
}

export const TertiaryVariant: Story = {
  args: {
    as: 'button',
    icon: 'tabler:cube',
    children: 'Tertiary',
    tProps: {},
    variant: 'tertiary'
  },

  render: props => <Index {...props} />
}

export const PlaintVariant: Story = {
  args: {
    as: 'button',
    icon: 'tabler:cube',
    children: 'Plain Button',
    tProps: {},
    variant: 'plain'
  },

  render: props => <Index {...props} />
}

export const IconAtEnd: Story = {
  args: {
    as: 'button',
    icon: 'tabler:arrow-right',
    children: 'Proceed',
    tProps: {},
    iconAtEnd: true,
    loading: false
  },

  render: props => <Index {...props} />
}

export const Disabled: Story = {
  args: {
    as: 'button',
    icon: 'tabler:arrow-right',
    children: 'Submit',
    tProps: {},
    loading: false,
    disabled: true
  },

  render: props => <Index {...props} />
}

export const Loading: Story = {
  args: {
    as: 'button',
    icon: 'tabler:arrow-right',
    children: 'Loading',
    tProps: {},
    iconAtEnd: true,
    loading: true,
    disabled: false
  },

  render: props => <Index {...props} />
}

export const IconsOnly: Story = {
  args: {
    as: 'button',
    icon: 'tabler:arrows-exchange',
    children: '',
    tProps: {}
  },

  render: props => <Index {...props} />
}

export const IconsOnlyWithNoBg: Story = {
  args: {
    as: 'button',
    icon: 'tabler:arrows-exchange',
    children: '',
    tProps: {},
    variant: 'plain'
  },

  render: props => <Index {...props} />
}

export const RedButton: Story = {
  args: {
    as: 'button',
    icon: 'tabler:cube',
    children: 'Button',
    tProps: {},
    variant: 'primary',
    isRed: true
  },

  render: props => <Index {...props} />
}
