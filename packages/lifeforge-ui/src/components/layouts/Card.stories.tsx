import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@components/controls'

import ItemWrapper from './Card'

const meta = {
  component: ItemWrapper,
  argTypes: {
    children: {
      control: false
    }
  }
} satisfies Meta<typeof ItemWrapper>

export default meta

type Story = StoryObj<typeof meta>

/**
 * A simple card with default styling.
 */
export const Default: Story = {
  args: {
    children: <div className="p-4">This is a wrapped item</div>
  },
  render: args => (
    <div className="w-96 p-8">
      <ItemWrapper {...args} />
    </div>
  )
}

/**
 * An interactive card with hover effects.
 */
export const Interactive: Story = {
  args: {
    isInteractive: true,
    children: <div className="p-4">Click or hover me!</div>
  },
  render: args => (
    <div className="w-96 p-8">
      <ItemWrapper {...args} />
    </div>
  )
}

/**
 * An card rendered as a button.
 */
export const AsButton: Story = {
  args: {
    as: 'button',
    isInteractive: true,
    children: <div className="p-4">I'm a button wrapper</div>,
    onClick: () => alert('Button clicked!')
  },
  render: args => (
    <div className="w-96 p-8">
      <ItemWrapper {...args} />
    </div>
  )
}

/**
 * An card rendered as a link.
 */
export const AsLink: Story = {
  args: {
    as: 'a',
    isInteractive: true,
    href: 'https://docs.lifeforge.dev',
    target: '_blank',
    rel: 'noopener noreferrer',
    children: <div className="p-4">I&apos;m a link wrapper</div>
  },
  render: args => (
    <div className="w-96 p-8">
      <ItemWrapper {...args} />
    </div>
  )
}

/**
 * Multiple cards in a grid.
 */
export const MultipleItems: Story = {
  args: {
    children: <></>
  },
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-8">
      <ItemWrapper>
        <div className="p-4">Item 1</div>
      </ItemWrapper>
      <ItemWrapper isInteractive>
        <div className="p-4">Item 2 (Interactive)</div>
      </ItemWrapper>
      <ItemWrapper>
        <div className="p-4">Item 3</div>
      </ItemWrapper>
      <ItemWrapper isInteractive>
        <div className="p-4">Item 4 (Interactive)</div>
      </ItemWrapper>
    </div>
  )
}

/**
 * A card with a title and description.
 */
export const WithTitle: Story = {
  args: {
    children: <></>
  },
  render: () => (
    <div className="w-80 p-8">
      <ItemWrapper>
        <div className="p-4">
          <h2 className="mb-2 text-xl font-semibold">Card Title</h2>
          <p className="text-bg-500">
            This is an example of an card styled as a card with shadow.
          </p>
        </div>
      </ItemWrapper>
    </div>
  )
}

/**
 * A card with an image at the top.
 */
export const WithImage: Story = {
  args: {
    children: <></>
  },
  render: () => (
    <div className="flex-center w-[60vw] p-8">
      <ItemWrapper className="w-96 p-0!">
        <img
          alt="Card Image"
          className="aspect-video w-full rounded-t-lg object-cover"
          src="https://placehold.co/1600x900/png"
        />
        <div className="p-4">
          <h2 className="mb-2 text-xl font-semibold">Card with Image</h2>
          <p className="text-bg-500">
            This card includes an image at the top to enhance visual appeal.
          </p>
        </div>
      </ItemWrapper>
    </div>
  )
}

/**
 * A card with an image and a button.
 */
export const WithImageAndButton: Story = {
  args: {
    children: <></>
  },
  render: () => (
    <div className="flex-center w-[60vw] p-8">
      <ItemWrapper className="w-96 p-0!">
        <img
          alt="Card Image"
          className="aspect-video w-full rounded-t-lg object-cover"
          src="https://placehold.co/1600x900/png"
        />
        <div className="p-4">
          <h2 className="mb-2 text-xl font-semibold">
            Card with Image & Button
          </h2>
          <p className="text-bg-500 mb-4">
            This card includes an image and a call-to-action button.
          </p>
          <Button
            className="w-full"
            icon="tabler:arrow-right"
            iconPosition="end"
            variant="secondary"
          >
            Learn More
          </Button>
        </div>
      </ItemWrapper>
    </div>
  )
}
