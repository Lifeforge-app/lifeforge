import type { Meta, StoryObj } from '@storybook/react-vite'

import { Alert } from '@/components/feedback'
import { Flex } from '@/components/primitives'

import { Button } from './index'

const meta = {
  component: Button
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

/**
 * A primary button variant. Suitable for main actions.
 */
export const PrimaryVariant: Story = {
  args: {
    children: 'Button',
    disabled: false,
    icon: 'tabler:cube',
    iconPosition: 'start',
    onClick: () => {
      alert('Button clicked!')
    },
    tProps: {},
    variant: 'primary'
  },
  render: props => <Button {...props} />
}

/**
 * A secondary button variant. Suitable for less prominent actions.
 */
export const SecondaryVariant: Story = {
  args: {
    children: 'Secondary',
    icon: 'tabler:cube',
    tProps: {},
    variant: 'secondary'
  },
  render: props => <Button {...props} />
}

/**
 * A tertiary button variant. Suitable for less prominent actions.
 */
export const TertiaryVariant: Story = {
  args: {
    children: 'Tertiary',
    icon: 'tabler:cube',
    tProps: {},
    variant: 'tertiary'
  },

  render: props => <Button {...props} />
}

/**
 * A plain button variant. Suitable for actions without emphasis, or button with icon only.
 */
export const PlaintVariant: Story = {
  args: {
    children: 'Plain Button',
    icon: 'tabler:cube',
    tProps: {},
    variant: 'plain'
  },
  render: props => <Button {...props} />
}

/**
 * A button with the icon positioned at the end.
 */
export const IconAtEnd: Story = {
  args: {
    children: 'Proceed',
    icon: 'tabler:arrow-right',
    iconPosition: 'end',
    loading: false,
    tProps: {}
  },
  render: props => <Button {...props} />
}

/**
 * A button that is not interactive, indicating an action that is not available.
 */
export const Disabled: Story = {
  args: {
    children: 'Submit',
    disabled: true,
    icon: 'tabler:arrow-right',
    loading: false,
    tProps: {}
  },
  render: props => <Button {...props} />
}

/**
 * A button that indicates an action is in progress. A loading spinner is shown, and user input is disabled.
 */
export const Loading: Story = {
  args: {
    children: 'Loading',
    disabled: false,
    icon: 'tabler:arrow-right',
    iconPosition: 'start',
    loading: true,
    tProps: {}
  },
  render: props => <Button {...props} />
}

/**
 * A button that displays only an icon.
 */
export const IconsOnly: Story = {
  args: {
    children: '',
    icon: 'tabler:arrows-exchange',
    tProps: {}
  },
  render: props => <Button {...props} />
}

/**
 * A plain button that displays only an icon.
 */
export const IconsOnlyWithNoBg: Story = {
  args: {
    children: '',
    icon: 'tabler:arrows-exchange',
    tProps: {},
    variant: 'plain'
  },
  render: props => <Button {...props} />
}

/**
 * A red button variant. Suitable for destructive actions like deleting an item.
 */
export const RedButton: Story = {
  args: {
    children: 'Delete',
    dangerous: true,
    icon: 'tabler:trash',
    tProps: {},
    variant: 'primary'
  },
  render: props => <Button {...props} />
}

/**
 * A button with a long text that exceeds the typical length. This tests how the button handles overflow and truncation of text.
 */
export const WithLongText: Story = {
  args: {
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    icon: 'tabler:text-wrap',
    tProps: {}
  },
  render: props => (
    <Flex
      align="center"
      direction="column"
      justify="center"
      minWidth="0"
      width="100%"
    >
      <Flex
        style={{
          width: 'clamp(40vw, 40em, 80vw)'
        }}
      >
        <Button style={{ width: '100%' }} {...props} />
      </Flex>
    </Flex>
  )
}

export const AsDifferentComponent: Story = {
  args: {
    as: 'a',
    children: 'Open Link',
    href: 'https://docs.lifeforge.dev',
    icon: 'tabler:external-link',
    rel: 'noopener noreferrer',
    target: '_blank',
    tProps: {},
    variant: 'plain'
  },
  render: props => (
    <Flex
      align="center"
      direction="column"
      gap="md"
      justify="center"
      width="100%"
    >
      <Alert type="note">
        This button is rendered as an anchor tag that navigates to the LifeForge
        documentation. Open the console and inspect the element to verify that
        it is an anchor tag with the correct href, target, and rel attributes.
      </Alert>
      <Button {...props} />
    </Flex>
  )
}
