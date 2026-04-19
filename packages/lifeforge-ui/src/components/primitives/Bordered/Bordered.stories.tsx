import type { Meta, StoryObj } from '@storybook/react-vite'

import { Alert } from '@components/feedback'
import { Box, Flex, Grid, Text } from '@components/primitives'

import { ScrollableStory } from '@/storybook/ScrollableStory'

import { Bordered } from './index'

const meta = {
  component: Bordered,
  argTypes: {
    children: { control: false },
    borderColor: { control: false },
    bg: { control: false },
    color: { control: false },
    borderSide: {
      control: { type: 'select' },
      options: ['all', 'top', 'right', 'bottom', 'left', 'x', 'y']
    },
    borderStyle: {
      control: { type: 'select' },
      options: ['solid', 'dashed', 'dotted', 'double', 'none']
    },
    rounded: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full']
    }
  }
} satisfies Meta<typeof Bordered>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ─────────────────────────────────────────────────────────────────

function DemoBox({ label }: { label: string }) {
  return (
    <Flex align="center" justify="center" p="md">
      <Text color={{ base: 'bg-500', dark: 'bg-400' }} size="sm">
        {label}
      </Text>
    </Flex>
  )
}

// ─── Stories ─────────────────────────────────────────────────────────────────

/**
 * Default bordered container — 1px solid border using the standard neutral
 * palette tokens (`bg-200` in light mode, `bg-700` in dark mode).
 */
export const Default: Story = {
  args: {
    borderSide: 'all',
    borderStyle: 'solid',
    borderWidth: '1px'
  },
  render: args => (
    <Flex align="center" height="100%" justify="center" p="3xl" width="100%">
      <Bordered {...args} p="lg" rounded="lg" width="20rem">
        <Text as="p" color={{ base: 'bg-600', dark: 'bg-400' }}>
          A simple bordered container using the default neutral border color
          that adapts between light and dark themes automatically.
        </Text>
      </Bordered>
    </Flex>
  )
}

/**
 * Border color can be any design-system color token and supports all
 * theme conditions: `base`, `dark`, `hover`, `darkHover`.
 */
export const BorderColor: Story = {
  args: {},
  render: () => (
    <Grid columns="repeat(3, minmax(0, 1fr))" gap="lg" p="3xl" width="100%">
      <Bordered p="md" rounded="lg">
        <DemoBox label="Default (bg-200 / bg-700)" />
      </Bordered>

      <Bordered borderColor="custom-500" p="md" rounded="lg">
        <DemoBox label="custom-500 (flat)" />
      </Bordered>

      <Bordered
        borderColor={{ base: 'custom-300', dark: 'custom-600' }}
        p="md"
        rounded="lg"
      >
        <DemoBox label="custom-300 / custom-600 (adaptive)" />
      </Bordered>

      <Bordered
        borderColor={{
          base: 'bg-400',
          hover: 'custom-500',
          dark: 'bg-600',
          darkHover: 'custom-400'
        }}
        p="md"
        rounded="lg"
      >
        <DemoBox label="hover + dark + darkHover conditions" />
      </Bordered>

      <Bordered
        borderColor={{ base: 'bg-200', dark: 'bg-800' }}
        p="md"
        rounded="lg"
      >
        <DemoBox label="bg-200 / bg-800 (subtle)" />
      </Bordered>

      <Bordered
        borderColor={{ base: 'custom-500', dark: 'custom-400' }}
        borderWidth="2px"
        p="md"
        rounded="lg"
      >
        <DemoBox label="2px accent border" />
      </Bordered>
    </Grid>
  )
}

/**
 * `borderWidth` accepts any CSS length string. Common choices are
 * `'1px'`, `'2px'`, and `'4px'`.
 */
export const BorderWidth: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      {(['1px', '2px', '4px', '8px'] as const).map(w => (
        <Bordered key={w} borderWidth={w} p="md" rounded="lg">
          <DemoBox label={`borderWidth="${w}"`} />
        </Bordered>
      ))}
    </ScrollableStory>
  )
}

/**
 * All five `borderStyle` values are supported.
 */
export const BorderStyle: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      {(['solid', 'dashed', 'dotted', 'double', 'none'] as const).map(s => (
        <Bordered key={s} borderStyle={s} borderWidth="2px" p="md" rounded="lg">
          <DemoBox label={`borderStyle="${s}"`} />
        </Bordered>
      ))}
    </ScrollableStory>
  )
}

/**
 * `borderSide` controls which edge(s) the border is drawn on.
 * Inactive sides are explicitly reset, preventing inherited values.
 */
export const BorderSide: Story = {
  args: {},
  render: () => (
    <Grid columns="repeat(4, minmax(0, 1fr))" gap="lg" p="3xl" width="100%">
      {(['all', 'top', 'right', 'bottom', 'left', 'x', 'y'] as const).map(
        side => (
          <Bordered
            key={side}
            borderColor="custom-500"
            borderSide={side}
            borderWidth="2px"
            p="md"
            rounded="lg"
          >
            <DemoBox label={`borderSide="${side}"`} />
          </Bordered>
        )
      )}
    </Grid>
  )
}

/**
 * Combining `rounded` with a border produces a card-like appearance.
 * All radius tokens are demonstrated.
 */
export const BorderRadius: Story = {
  args: {},
  render: () => (
    <Grid columns="repeat(4, minmax(0, 1fr))" gap="lg" p="3xl" width="100%">
      {(['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'] as const).map(
        r => (
          <Bordered key={r} p="md" rounded={r}>
            <DemoBox label={`rounded="${r}"`} />
          </Bordered>
        )
      )}
    </Grid>
  )
}

/**
 * `Bordered` accepts a `bg` prop for an adaptive background color, making
 * it a complete card/panel primitive out of the box.
 */
export const WithBackground: Story = {
  args: {},
  render: () => (
    <Grid columns="repeat(2, minmax(0, 1fr))" gap="lg" p="3xl" width="100%">
      <Bordered
        shadow
        bg={{ base: 'bg-50', dark: 'bg-900' }}
        p="lg"
        rounded="lg"
      >
        <Text as="p" color={{ base: 'bg-600', dark: 'bg-400' }}>
          bg + border + shadow — a complete card panel.
        </Text>
      </Bordered>

      <Bordered
        bg={{ base: 'custom-50', dark: 'custom-900' }}
        borderColor="custom-500"
        borderWidth="2px"
        p="lg"
        rounded="lg"
      >
        <Text as="p" color={{ base: 'custom-700', dark: 'custom-300' }}>
          Accent-tinted background with matching border.
        </Text>
      </Bordered>
    </Grid>
  )
}

/**
 * A common UI pattern: a thick left-side accent bar used for callouts,
 * info boxes, and timeline items.
 */
export const AccentBar: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      <Bordered
        bg={{ base: 'bg-50', dark: 'bg-900' }}
        borderColor="custom-500"
        borderSide="left"
        borderWidth="4px"
        pl="lg"
        py="md"
        rounded="sm"
      >
        <Text weight="semibold">Info callout</Text>
        <Text as="p" color={{ base: 'bg-500', dark: 'bg-400' }} mt="xs">
          Use <code>borderSide=&quot;left&quot;</code> with{' '}
          <code>borderWidth=&quot;4px&quot;</code>
          for a classic callout accent bar.
        </Text>
        <Box mt="md">
          <Alert type="tip">
            However, you&apos;re recommended to use the dedicated{' '}
            <code>Alert</code> component for this common pattern, which
            constructs the accent bar by utilizing pseudo-elements that allows
            rounded corners for the border.
          </Alert>
        </Box>
      </Bordered>

      <Bordered
        bg={{ base: 'bg-50', dark: 'bg-900' }}
        borderColor={{ base: 'bg-300', dark: 'bg-600' }}
        borderSide="bottom"
        borderWidth="2px"
        p="md"
      >
        <Text weight="semibold">Section separator</Text>
        <Text as="p" color={{ base: 'bg-500', dark: 'bg-400' }} mt="xs">
          <code>borderSide=&quot;bottom&quot;</code> works as a section divider.
        </Text>
      </Bordered>
    </ScrollableStory>
  )
}

/**
 * `asChild` merges all Bordered classes and styles onto the single child
 * element, letting you apply a border to any existing component.
 */
export const AsChild: Story = {
  args: {},
  render: () => (
    <Flex align="center" height="100%" justify="center" p="3xl" width="100%">
      <Flex
        direction="column"
        gap="md"
        style={{ maxWidth: '24rem', width: '100%' }}
      >
        <Alert type="note">
          Open the browser dev tools to inspect the DOM structure of the given
          examples.
        </Alert>
        <Bordered
          asChild
          borderColor="custom-500"
          borderWidth="2px"
          p="lg"
          rounded="lg"
        >
          <Flex
            align="center"
            bg={{ base: 'bg-50', dark: 'bg-900' }}
            direction="column"
            gap="sm"
            width="20rem"
          >
            <Text weight="semibold">asChild composition</Text>
            <Text
              align="center"
              color={{ base: 'bg-500', dark: 'bg-400' }}
              size="sm"
            >
              Bordered merges onto the Flex child — no extra DOM node.
            </Text>
          </Flex>
        </Bordered>
      </Flex>
    </Flex>
  )
}
