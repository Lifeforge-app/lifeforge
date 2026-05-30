import type { Meta, StoryObj } from '@storybook/react-vite'

import { Alert } from '@/components/feedback'
import { Box, Flex, Text } from '@/components/primitives'
import { VariantContainer } from '@/storybook/VariantContainer'
import { COLORS, colorWithOpacity } from '@/system'

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
    <Flex direction="column" gap="lg">
      <Text as="p" color={{ base: 'bg-500', dark: 'bg-400' }}>
        <Text weight="semibold">Slot</Text> receives props and forwards them
        onto its single child - no extra DOM node is added.
      </Text>

      <Box bg={{ base: 'bg-50', dark: 'bg-800' }} p="md" r="lg">
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
              padding: '0.75rem 1rem'
            }}
            type="button"
          >
            <Text display="block" mb="sm" size="lg" weight="semibold">
              I am a &lt;button&gt;
            </Text>
            <Text as="p" color={{ base: 'bg-500', dark: 'bg-400' }}>
              Slot forwarded a dashed outline style and an extra className onto
              this button element directly.
            </Text>
          </button>
        </Slot>
      </Box>
    </Flex>
  )
}

/**
 * When the `asChild` prop is used on a primitive, the primitive renders a
 * `Slot` internally, applying all its sprinkle classes and layout styles to
 * the child. The result is semantically correct HTML with no extra wrapper.
 *
 * Compare the two boxes below - both look identical but the right one has
 * no extra `<div>` in the DOM.
 */
export const AsChildPattern: Story = {
  args: {
    children: <></>
  },
  render: () => (
    <Flex direction="column" gap="md">
      <Alert type="note">
        Open the browser dev tools to inspect the DOM structure of the given
        examples.
      </Alert>
      <VariantContainer title="Without asChild - extra <div> wrapper:">
        <Box shadow bg={{ base: 'bg-50', dark: 'bg-900' }} p="lg" r="xl">
          <article>
            <Text weight="semibold">Box wraps &lt;article&gt;</Text>
            <Text as="p" color={{ base: 'bg-500', dark: 'bg-400' }} mt="xs">
              DOM: &lt;div&gt; → &lt;article&gt;
            </Text>
          </article>
        </Box>
      </VariantContainer>
      <VariantContainer title="With asChild - styles applied directly to <article>:">
        <Box
          asChild
          shadow
          bg={{ base: 'bg-50', dark: 'bg-900' }}
          p="lg"
          r="xl"
        >
          <article>
            <Text weight="semibold">Box is &lt;article&gt;</Text>
            <Text as="p" color={{ base: 'bg-500', dark: 'bg-400' }} mt="xs">
              DOM: &lt;article&gt; (no wrapper div)
            </Text>
          </article>
        </Box>
      </VariantContainer>
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
      <VariantContainer title="Both classes are applied - inspect the element to verify:">
        <Slot className="from-slot">
          <span
            className="from-child"
            style={{
              background: COLORS['custom-500'],
              borderRadius: '0.5rem',
              display: 'block',
              padding: '0.75rem'
            }}
          >
            className=&quot;from-slot from-child&quot;
          </span>
        </Slot>
      </VariantContainer>
    </Flex>
  )
}

/**
 * `Slot` merges `style` objects - properties from Slot and the child are
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
      <VariantContainer title="Slot sets padding + outline; child sets background. Both are applied:">
        <Slot
          style={{
            outline: `2px dashed ${COLORS['custom-500']}`,
            padding: '1.5rem'
          }}
        >
          <Box bg={colorWithOpacity('custom-500', '20%')} r="md">
            <Text>Slot style + child style merged</Text>
          </Box>
        </Slot>
      </VariantContainer>
    </Flex>
  )
}
