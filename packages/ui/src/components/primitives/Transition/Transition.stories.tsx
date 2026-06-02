import type { Meta, StoryObj } from '@storybook/react-vite'
import { type ReactNode, useState } from 'react'

import { Alert } from '@/components/feedback'
import { Switch } from '@/components/inputs'
import { Box, Flex, Text } from '@/components/primitives'
import { ScrollableStory } from '@/storybook/ScrollableStory'
import { VariantContainer } from '@/storybook/VariantContainer'
import { COLORS } from '@/system'

import { Transition } from './index'

const meta = {
  argTypes: {
    children: { control: false }
  },
  component: Transition,
  title: 'Primitives/Transition'
} satisfies Meta<typeof Transition>

export default meta

type Story = StoryObj<typeof meta>

function Demo({
  children,
  label
}: {
  label: string
  children: (on: boolean) => ReactNode
}) {
  const [on, setOn] = useState(false)

  return (
    <VariantContainer title={label}>
      <Flex direction="column" gap="md">
        <Flex align="center" justify="between">
          <Text as="p">Toggle animation</Text>
          <Switch value={on} onChange={setOn} />
        </Flex>
        {children(on)}
      </Flex>
    </VariantContainer>
  )
}

/**
 * Applies a transition to the `opacity` property. Toggle the switch to see the
 * box fade in and out.
 */
export const Opacity: Story = {
  args: { children: null },
  render: () => (
    <ScrollableStory>
      <Alert type="note">
        Open the browser dev tools to inspect the <code>transition</code>{' '}
        property applied to the wrapper element.
      </Alert>
      <Demo label="opacity — duration: 400ms, easing: ease">
        {on => (
          <Transition duration={400} easing="ease" property="opacity">
            <Box
              bg={{ base: 'custom-500' }}
              p="lg"
              r="lg"
              style={{ opacity: on ? 1 : 0 }}
            >
              <Text color="bg-50" weight="semibold">
                Fading box
              </Text>
            </Box>
          </Transition>
        )}
      </Demo>
      <Demo label="transform (scale) — duration: 300ms, easing: ease-out">
        {on => (
          <Transition duration={300} easing="ease-out" property="transform">
            <Box
              shadow
              bg={{ base: 'bg-50', dark: 'bg-800' }}
              p="lg"
              r="lg"
              style={{
                transform: on ? 'scale(1)' : 'scale(0.8)',
                transformOrigin: 'top left'
              }}
            >
              <Text color={{ base: 'bg-800', dark: 'bg-50' }} weight="semibold">
                Scaling box
              </Text>
            </Box>
          </Transition>
        )}
      </Demo>
      <Demo label="background-color — duration: 600ms, easing: ease-in-out">
        {on => (
          <Transition
            duration={600}
            easing="ease-in-out"
            property="background-color"
          >
            <Box
              p="lg"
              r="lg"
              style={{
                backgroundColor: on
                  ? COLORS['custom-500']
                  : 'var(--color-bg-200)'
              }}
            >
              <Text
                color={on ? 'bg-50' : { base: 'bg-800', dark: 'bg-50' }}
                weight="semibold"
              >
                Background changes color
              </Text>
            </Box>
          </Transition>
        )}
      </Demo>
      <Demo label="box-shadow — duration: 300ms, easing: ease">
        {on => (
          <Transition duration={300} easing="ease" property="box-shadow">
            <Box
              bg={{ base: 'bg-50', dark: 'bg-800' }}
              p="lg"
              r="lg"
              style={{
                boxShadow: on
                  ? '0 8px 24px rgba(0,0,0,0.25)'
                  : '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              <Text color={{ base: 'bg-800', dark: 'bg-50' }} weight="semibold">
                Shadow grows on toggle
              </Text>
            </Box>
          </Transition>
        )}
      </Demo>
    </ScrollableStory>
  )
}

/**
 * Demonstrates transitioning multiple properties simultaneously.
 */
export const MultiProperty: Story = {
  args: { children: null },
  render: () => (
    <Flex direction="column" gap="md">
      <Demo label="opacity + transform — shared duration: 400ms, easing: ease-out">
        {on => (
          <Transition
            duration={400}
            easing="ease-out"
            property={['opacity', 'transform']}
          >
            <Box
              bg={{ base: 'custom-500' }}
              p="lg"
              r="lg"
              style={{
                opacity: on ? 1 : 0,
                transform: on ? 'translateX(0)' : 'translateX(1.5rem)'
              }}
            >
              <Text color="bg-50" weight="semibold">
                Moves and fades at the same time
              </Text>
            </Box>
          </Transition>
        )}
      </Demo>

      <Demo label="width + height — duration: 500ms, easing: ease">
        {on => (
          <Transition
            duration={500}
            easing="ease"
            property={['width', 'height']}
          >
            <Box
              shadow
              bg={{ base: 'bg-50', dark: 'bg-800' }}
              p="lg"
              r="lg"
              style={{
                height: on ? '8rem' : '3rem',
                overflow: 'hidden',
                width: on ? '100%' : '50%'
              }}
            >
              <Text color={{ base: 'bg-800', dark: 'bg-50' }} weight="semibold">
                Box expands
              </Text>
            </Box>
          </Transition>
        )}
      </Demo>
    </Flex>
  )
}

/**
 * Demonstrates per-property overrides via `TransitionEntry` objects.
 * Each property can have its own duration, easing, and delay.
 */
export const PerPropertyOverrides: Story = {
  args: { children: null },
  render: () => (
    <Flex direction="column" gap="md">
      <Demo label="opacity (ease, 200ms) + transform (ease-out, 600ms, 100ms delay)">
        {on => (
          <Transition
            property={[
              { duration: 200, easing: 'ease', property: 'opacity' },
              {
                delay: 100,
                duration: 600,
                easing: 'ease-out',
                property: 'transform'
              }
            ]}
          >
            <Box
              bg={{ base: 'custom-500' }}
              p="lg"
              r="lg"
              style={{
                opacity: on ? 1 : 0,
                transform: on ? 'rotate(0deg)' : 'rotate(8deg)'
              }}
            >
              <Text color="bg-50" weight="semibold">
                Opacity fades fast; rotation takes longer with a delay
              </Text>
            </Box>
          </Transition>
        )}
      </Demo>

      <Demo label="background-color (1s, ease) + color (300ms, ease-in)">
        {on => (
          <Transition
            property={[
              {
                duration: 1000,
                easing: 'ease',
                property: 'background-color'
              },
              { duration: 300, easing: 'ease-in', property: 'color' }
            ]}
          >
            <Box
              p="lg"
              r="lg"
              style={{
                backgroundColor: on
                  ? 'var(--color-bg-800)'
                  : 'var(--color-bg-200)',
                color: on ? '#fff' : 'var(--color-bg-800)'
              }}
            >
              <Text weight="semibold">
                Background takes 1s, text color is instant
              </Text>
            </Box>
          </Transition>
        )}
      </Demo>
    </Flex>
  )
}

/**
 * Demonstrates a transition triggered by hover. Uses mouse events to toggle
 * state, driving inline styles — showing how `Transition` powers interactive
 * UI without framework-level animation libraries.
 */
export const HoverTriggered: Story = {
  args: { children: null },
  render: () => {
    return (
      <VariantContainer title="background-color on hover — 400ms ease">
        <Transition duration={400} easing="ease" property="background-color">
          <Box
            as="button"
            bg={{
              base: 'bg-200',
              hover: 'custom-500'
            }}
            p="md"
            r="md"
            width="100%"
          >
            <Text weight="semibold">
              Hover me — background color transitions
            </Text>
          </Box>
        </Transition>
      </VariantContainer>
    )
  }
}

/**
 * Demonstrates a single property using a `TransitionEntry` object (shorthand
 * for when you want to tune one property without using an array).
 */
export const SingleEntryObject: Story = {
  args: { children: null },
  render: () => {
    return (
      <Demo label="Single TransitionEntry — border-color, 500ms, ease-out, with 200ms delay">
        {on => (
          <Transition
            property={{
              delay: 200,
              duration: 500,
              easing: 'ease-out',
              property: 'border-color'
            }}
          >
            <Box
              bg={{ base: 'bg-50', dark: 'bg-800' }}
              p="lg"
              r="lg"
              style={{
                border: '3px solid',
                borderColor: on ? COLORS['custom-500'] : 'var(--color-bg-300)'
              }}
            >
              <Text color={{ base: 'bg-800', dark: 'bg-50' }} weight="semibold">
                Border color transitions with a 200ms delay
              </Text>
            </Box>
          </Transition>
        )}
      </Demo>
    )
  }
}
