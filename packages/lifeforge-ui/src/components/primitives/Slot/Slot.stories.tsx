import type { Meta, StoryObj } from '@storybook/react-vite'

import { Alert } from '@components/feedback'
import { Box, Flex, Text } from '@components/primitives'

import { Slot } from './index'

const meta = {
  argTypes: {
    children: { control: false }
  },
  component: Slot
} satisfies Meta<typeof Slot>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * `Slot` forwards all its own props onto its single child element and merges
 * `className` values. It is the building block behind the `asChild` prop on
 * every other primitive: when `asChild` is true the primitive renders a
 * `<Slot>` instead of its own DOM element, so styling lands on the child.
 *
 * Here a wrapper `<div>` applies a className and style to a `<button>` child
 * without adding a DOM node.
 */
export const Default: Story = {
  args: {
    children: <></>
  },
  render: () => (
    <Flex align="center" height="100%" justify="center" p="3xl" width="100%">
      <Flex
        direction="column"
        gap="lg"
        style={{ maxWidth: '32rem', width: '100%' }}
      >
        <Text as="p" color={{ base: 'bg-500', dark: 'bg-400' }}>
          <Text weight="semibold">Slot</Text> receives props and forwards them
          onto its single child — no extra DOM node is added.
        </Text>

        <Box bg={{ base: 'bg-50', dark: 'bg-800' }} p="md" rounded="lg">
          <Slot
            className="extra-class-from-slot"
            style={{ outline: '2px dashed oklch(0.6 0.1 220)' }}
          >
            <button
              style={{
                all: 'unset',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'block',
                padding: '0.75rem 1rem',
                width: '100%'
              }}
              type="button"
            >
              <Text display="block" mb="sm" size="lg" weight="semibold">
                I am a &lt;button&gt;
              </Text>
              <Text as="p" color={{ base: 'bg-500', dark: 'bg-400' }}>
                Slot forwarded a dashed outline style and an extra className
                onto this button element directly.
              </Text>
            </button>
          </Slot>
        </Box>
      </Flex>
    </Flex>
  )
}

/**
 * When the `asChild` prop is used on a primitive, the primitive renders a
 * `Slot` internally, applying all its sprinkle classes and layout styles to
 * the child. The result is semantically correct HTML with no extra wrapper.
 *
 * Compare the two boxes below — both look identical but the right one has
 * no extra `<div>` in the DOM.
 */
export const AsChildPattern: Story = {
  args: {
    children: <></>
  },
  render: () => (
    <Flex
      direction="column"
      gap="xl"
      style={{ maxWidth: '32rem', width: '100%' }}
    >
      <Alert type="note">
        Open the browser dev tools to inspect the DOM structure of the given
        examples.
      </Alert>
      <Box>
        <Text
          color={{ base: 'bg-500', dark: 'bg-400' }}
          display="block"
          mb="sm"
        >
          Without asChild — extra &lt;div&gt; wrapper:
        </Text>
        <Box shadow bg={{ base: 'bg-50', dark: 'bg-900' }} p="lg" rounded="xl">
          <article>
            <Text weight="semibold">Box wraps &lt;article&gt;</Text>
            <Text as="p" color={{ base: 'bg-500', dark: 'bg-400' }} mt="xs">
              DOM: &lt;div&gt; → &lt;article&gt;
            </Text>
          </article>
        </Box>
      </Box>

      <Box>
        <Text
          color={{ base: 'bg-500', dark: 'bg-400' }}
          display="block"
          mb="sm"
        >
          With asChild — styles applied directly to &lt;article&gt;:
        </Text>
        <Box
          asChild
          shadow
          bg={{ base: 'bg-50', dark: 'bg-900' }}
          p="lg"
          rounded="xl"
        >
          <article>
            <Text weight="semibold">Box is &lt;article&gt;</Text>
            <Text as="p" color={{ base: 'bg-500', dark: 'bg-400' }} mt="xs">
              DOM: &lt;article&gt; (no wrapper div)
            </Text>
          </article>
        </Box>
      </Box>
    </Flex>
  )
}

/**
 * `Slot` merges `className` strings from the Slot itself and the child,
 * so both sources of class names are preserved.
 */
export const ClassNameMerging: Story = {
  args: {
    children: <></>
  },
  render: () => (
    <Flex
      direction="column"
      gap="md"
      style={{ maxWidth: '32rem', width: '100%' }}
    >
      <Alert type="note">
        Open the browser dev tools to inspect the DOM structure of the given
        examples.
      </Alert>
      <Text color={{ base: 'bg-500', dark: 'bg-400' }}>
        Both classes are applied — inspect the element to verify:
      </Text>
      <Slot className="from-slot">
        <span
          className="from-child"
          style={{
            background: 'oklch(0.95 0.02 220)',
            borderRadius: '0.5rem',
            display: 'block',
            padding: '0.75rem'
          }}
        >
          className=&quot;from-slot from-child&quot;
        </span>
      </Slot>
    </Flex>
  )
}

/**
 * `Slot` merges `style` objects — properties from Slot and the child are
 * merged, with the child's values taking precedence on collision.
 */
export const StyleMerging: Story = {
  args: {
    children: <></>
  },
  render: () => (
    <Flex
      direction="column"
      gap="md"
      style={{ maxWidth: '32rem', width: '100%' }}
    >
      <Alert type="note">
        Open the browser dev tools to inspect the DOM structure of the given
        examples.
      </Alert>
      <Text color={{ base: 'bg-500', dark: 'bg-400' }}>
        Slot sets padding + outline; child sets background. Both are applied:
      </Text>
      <Slot
        style={{
          outline: '2px dashed oklch(0.5 0.15 260)',
          padding: '1.5rem'
        }}
      >
        <div
          style={{
            background: 'oklch(0.95 0.03 220)',
            borderRadius: '0.5rem'
          }}
        >
          <Text>Slot style + child style merged</Text>
        </div>
      </Slot>
    </Flex>
  )
}
