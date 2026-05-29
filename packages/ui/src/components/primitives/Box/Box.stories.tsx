import type { Meta, StoryObj } from '@storybook/react-vite'

import { Alert } from '@/components/feedback'
import { Box, Flex, Grid, Text } from '@/components/primitives'
import { ScrollableStory } from '@/storybook/ScrollableStory'

import { Box as BoxComponent } from './index'

const meta = {
  argTypes: {
    bg: { control: false },
    children: { control: false },
    display: {
      control: { type: 'select' },
      options: ['block', 'inline', 'inline-block', 'none', 'contents']
    },
    overflow: {
      control: { type: 'select' },
      options: ['visible', 'hidden', 'scroll', 'auto']
    },
    position: {
      control: { type: 'select' },
      options: ['static', 'relative', 'absolute', 'fixed', 'sticky']
    },
    rounded: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full']
    }
  },
  component: BoxComponent
} satisfies Meta<typeof BoxComponent>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function PlaceholderContent({
  asCode,
  children,
  label
}: {
  label?: string
  children?: React.ReactNode
  asCode?: boolean
}) {
  return (
    <Text
      as={asCode ? 'code' : undefined}
      color={{ base: 'bg-500', dark: 'bg-400' }}
    >
      {label ?? children ?? 'Box content'}
    </Text>
  )
}

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * The default `Box` is a block-level `<div>` with `box-sizing: border-box`.
 * It carries no layout opinions of its own - use it as a wrapper, spacer,
 * or structural anchor wherever layout primitives (`Flex`, `Grid`) are too
 * opinionated.
 */
export const Default: Story = {
  args: {
    p: 'lg'
  },
  render: args => (
    <Flex align="center" height="100%" justify="center" p="3xl" width="100%">
      <Box
        {...args}
        bg={{ base: 'bg-50', dark: 'bg-800' }}
        r="lg"
        style={{ width: '20rem' }}
      >
        <PlaceholderContent />
      </Box>
    </Flex>
  )
}

/**
 * The `as` prop swaps the underlying HTML element while keeping all Box
 * behaviour. Here the same padding, background, and radius are applied to
 * an `<article>`, `<header>`, and `<aside>` element respectively.
 */
export const PolymorphicElement: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      <Alert type="note">
        Open the browser dev tools to inspect the DOM structure of the given
        examples.
      </Alert>
      {(['article', 'header', 'aside', 'nav', 'main'] as const).map(tag => (
        <Box
          key={tag}
          as={tag}
          bg={{ base: 'bg-50', dark: 'bg-800' }}
          p="md"
          r="md"
        >
          <Text as="code" color={{ base: 'bg-500', dark: 'bg-400' }} size="sm">
            as=&quot;{tag}&quot;
          </Text>
        </Box>
      ))}
    </ScrollableStory>
  )
}

/**
 * `bg` accepts either a flat `ColorToken` or a per-condition map
 * (`ThemeConditionProp`), supporting `base`, `dark`, `hover`, `darkHover`,
 * `hasBgImage`, and `darkHasBgImage`.
 */
export const BackgroundColor: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      <Box bg="bg-50" p="md" r="lg">
        <PlaceholderContent asCode label="bg='bg-50' (flat)" />
      </Box>

      <Box bg={{ base: 'bg-50', dark: 'bg-800' }} p="md" r="lg">
        <PlaceholderContent
          asCode
          label="bg={{ base: 'bg-50', dark: 'bg-800' }}"
        />
      </Box>

      <Box
        bg={{
          base: 'bg-50',
          dark: 'bg-800',
          darkHover: 'bg-700',
          hover: 'bg-200'
        }}
        p="md"
        r="lg"
        style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
      >
        <PlaceholderContent
          asCode
          label="hover + dark + darkHover (hover me)"
        />
      </Box>

      <Box bg={{ base: 'custom-100', dark: 'custom-900' }} p="md" r="lg">
        <PlaceholderContent
          asCode
          label="bg={{ base: 'custom-100', dark: 'custom-900' }}"
        />
      </Box>
    </ScrollableStory>
  )
}

/**
 * `rounded` maps to the design-system radius token set and supports
 * responsive values. All eight tokens are demonstrated.
 */
export const BorderRadius: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      {(['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'] as const).map(
        r => (
          <Box key={r} bg={{ base: 'bg-50', dark: 'bg-800' }} p="md" r={r}>
            <PlaceholderContent asCode label={`r="${r}"`} />
          </Box>
        )
      )}
    </ScrollableStory>
  )
}

/**
 * `shadow` adds `var(--custom-shadow)` box-shadow matching the global
 * design-system elevation token.
 */
export const Shadow: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      <Box bg={{ base: 'bg-50', dark: 'bg-800' }} p="lg" r="lg">
        <PlaceholderContent label="Without shadow" />
      </Box>

      <Box shadow bg={{ base: 'bg-50', dark: 'bg-800' }} p="lg" r="lg">
        <PlaceholderContent label="With shadow" />
      </Box>
    </ScrollableStory>
  )
}

/**
 * All `SpaceToken` values map directly to padding and margin shorthand props.
 * The token table: `none` = 0, `xs` = 0.25rem, `sm` = 0.5rem, `md` = 1rem,
 * `lg` = 1.5rem, `xl` = 2rem, `2xl` = 3rem, `3xl` = 4rem.
 */
export const Spacing: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      {(['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const).map(
        token => (
          <Box
            key={token}
            bg={{ base: 'bg-50', dark: 'bg-800' }}
            p={token}
            r="md"
          >
            <Box bg={{ base: 'bg-200', dark: 'bg-700' }} p="xs" r="sm">
              <PlaceholderContent asCode label={`p="${token}"`} />
            </Box>
          </Box>
        )
      )}
    </ScrollableStory>
  )
}

/**
 * `width`, `height`, `minWidth`, `maxWidth`, etc. accept any CSS string and
 * support responsive objects with breakpoint keys.
 */
export const Sizing: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      <Box
        bg={{ base: 'bg-50', dark: 'bg-800' }}
        height="4rem"
        p="md"
        r="md"
        width="100%"
      >
        <PlaceholderContent asCode label="width='100%' height='4rem'" />
      </Box>

      <Box
        bg={{ base: 'bg-50', dark: 'bg-800' }}
        height="8rem"
        maxWidth="24rem"
        minWidth="8rem"
        p="md"
        r="md"
        width="50%"
      >
        <PlaceholderContent
          asCode
          label="width='50%' minWidth='8rem' maxWidth='24rem'"
        />
      </Box>
      <Box
        bg={{ base: 'bg-50', dark: 'bg-800' }}
        p="md"
        r="md"
        width={{ base: '100%', md: '50%', sm: '75%' }}
      >
        <PlaceholderContent
          asCode
          label="Responsive: 100% → 75% (sm) → 50% (md)"
        />
      </Box>
    </ScrollableStory>
  )
}

/**
 * `position`, `top`, `right`, `bottom`, `left`, `inset`, and `zIndex` are
 * all available for manual positioning when needed.
 */
export const Positioning: Story = {
  args: {},
  render: () => (
    <Box height="16rem" p="3xl" position="relative" style={{ width: '100%' }}>
      <Box
        bg={{ base: 'bg-50', dark: 'bg-800' }}
        height="100%"
        position="relative"
        r="lg"
        width="100%"
      >
        <PlaceholderContent asCode label="position='relative'" />
        <Box
          bg={{ base: 'custom-500' }}
          bottom="0"
          p="xs"
          position="absolute"
          right="0"
          r="md"
          style={{ margin: '0.5rem' }}
        >
          <PlaceholderContent
            asCode
            label="position='absolute' bottom='0' right='0'"
          />
        </Box>
      </Box>
    </Box>
  )
}

/**
 * `overflow`, `overflowX`, `overflowY` control content clipping. A common
 * pattern is `overflow="hidden"` on a card with `rounded`.
 */
export const Overflow: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      <Box
        bg={{ base: 'bg-50', dark: 'bg-800' }}
        height="5rem"
        overflow="hidden"
        p="md"
        r="lg"
      >
        <PlaceholderContent>
          <code>overflow=&quot;hidden&quot;</code> - this content is clipped
          when it exceeds the container height. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
          labore.
        </PlaceholderContent>
      </Box>

      <Box
        bg={{ base: 'bg-50', dark: 'bg-800' }}
        height="5rem"
        overflowY="auto"
        p="md"
        r="lg"
      >
        <PlaceholderContent>
          <code>overflowY=&quot;auto&quot;</code> - scrollable when content
          overflows the fixed height. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Sed do eiusmod tempor incididunt ut labore. Duis aute
          irure dolor in reprehenderit in voluptate velit esse cillum dolore.
          <br />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore.
          <br />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore.
        </PlaceholderContent>
      </Box>
    </ScrollableStory>
  )
}

/**
 * `display` controls the CSS `display` property. Useful for toggling
 * visibility (`none`) or making a block element `inline`.
 */
export const Display: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      {(['block', 'inline', 'inline-block'] as const).map(d => (
        <Box key={d} bg={{ base: 'bg-50', dark: 'bg-900' }} p="md" r="lg">
          <Text
            as="div"
            color={{ base: 'bg-500', dark: 'bg-400' }}
            mb="sm"
            size="sm"
          >
            <code>display=&quot;{d}&quot;</code>:
          </Text>
          <Box
            bg={{ base: 'custom-100', dark: 'custom-900' }}
            display={d}
            minHeight="3em"
            minWidth="3em"
            p="sm"
            r="sm"
          >
            <Text size="sm">A</Text>
          </Box>
          <Box
            bg={{ base: 'bg-200', dark: 'bg-700' }}
            display={d}
            minHeight="3em"
            minWidth="3em"
            p="sm"
            r="sm"
          >
            <Text size="sm">B</Text>
          </Box>
        </Box>
      ))}
    </ScrollableStory>
  )
}

/**
 * `gridColumn` and `gridRow` make `Box` useful as a spanning child inside a
 * `Grid`. These must be set on the immediate child of the grid container.
 */
export const GridChildSpanning: Story = {
  args: {},
  render: () => (
    <Grid gap="md" p="3xl" templateCols={3}>
      <Box
        bg={{ base: 'custom-100', dark: 'custom-900' }}
        gridColumnSpan={2}
        p="md"
        r="md"
      >
        <PlaceholderContent asCode label="gridColumn='span 2 / span 2'" />
      </Box>

      <Box bg={{ base: 'bg-50', dark: 'bg-800' }} p="md" r="md">
        <PlaceholderContent asCode label="1 col" />
      </Box>

      <Box bg={{ base: 'bg-50', dark: 'bg-800' }} p="md" r="md">
        <PlaceholderContent asCode label="1 col" />
      </Box>

      <Box
        bg={{ base: 'custom-100', dark: 'custom-900' }}
        gridColumnSpan={2}
        p="md"
        r="md"
      >
        <PlaceholderContent asCode label="gridColumn='span 2 / span 2'" />
      </Box>
    </Grid>
  )
}

/**
 * `asChild` merges all Box classes and styles onto the single child element,
 * so you can apply Box styling to any existing component without adding
 * an extra DOM node.
 */
export const AsChild: Story = {
  args: {},
  render: () => (
    <Flex align="center" height="100%" justify="center" p="3xl" width="100%">
      <Flex
        direction="column"
        gap="md"
        style={{ maxWidth: '32rem', width: '100%' }}
      >
        <Alert type="note">
          Open the browser dev tools to inspect the DOM structure of the given
          examples.
        </Alert>
        <Box
          asChild
          shadow
          bg={{ base: 'bg-50', dark: 'bg-800' }}
          p="lg"
          r="xl"
        >
          <section>
            <Text weight="semibold">
              <code>asChild</code> - rendered as <code>&lt;section&gt;</code>
            </Text>
            <Text as="p" color={{ base: 'bg-500', dark: 'bg-400' }} mt="xs">
              No extra wrapper div - the Box styles are applied directly to the
              child element via the Slot mechanism.
            </Text>
          </section>
        </Box>
      </Flex>
    </Flex>
  )
}
