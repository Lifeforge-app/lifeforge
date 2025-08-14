import type { Meta, StoryObj } from '@storybook/react-vite'

import Index from './index'

const meta = {
  component: Index
} satisfies Meta<typeof Index>

export default meta

type Story = StoryObj<typeof meta>

/**
 * A primary button variant. Suitable for main actions.
 */
export const PrimaryVariant: Story = {
  args: {
    as: 'button',
    icon: 'tabler:cube',
    disabled: false,
    children: 'Button',
    tProps: {},
    iconPosition: 'start',
    variant: 'primary'
  },
  render: props => <Index {...props} />
}

/**
 * A secondary button variant. Suitable for less prominent actions.
 */
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

/**
 * A tertiary button variant. Suitable for less prominent actions.
 */
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

/**
 * A plain button variant. Suitable for actions without emphasis, or button with icon only.
 */
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

/**
 * A button with the icon positioned at the end.
 */
export const IconAtEnd: Story = {
  args: {
    as: 'button',
    icon: 'tabler:arrow-right',
    children: 'Proceed',
    tProps: {},
    iconPosition: 'end',
    loading: false
  },
  render: props => <Index {...props} />
}

/**
 * A button that is not interactive, indicating an action that is not available.
 */
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

/**
 * A button that indicates an action is in progress. A loading spinner is shown, and user input is disabled.
 */
export const Loading: Story = {
  args: {
    as: 'button',
    icon: 'tabler:arrow-right',
    children: 'Loading',
    tProps: {},
    iconPosition: 'end',
    loading: true,
    disabled: false
  },
  render: props => <Index {...props} />
}

/**
 * A button that displays only an icon.
 */
export const IconsOnly: Story = {
  args: {
    as: 'button',
    icon: 'tabler:arrows-exchange',
    children: '',
    tProps: {}
  },
  render: props => <Index {...props} />
}

/**
 * A plain button that displays only an icon.
 */
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

/**
 * A red button variant. Suitable for destructive actions like deleting an item.
 */
export const RedButton: Story = {
  args: {
    as: 'button',
    icon: 'tabler:trash',
    children: 'Delete',
    tProps: {},
    variant: 'primary',
    dangerous: true
  },
  render: props => <Index {...props} />
}
