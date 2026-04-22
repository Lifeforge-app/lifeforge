import type { Meta, StoryObj } from '@storybook/react-vite'

import { Alert } from '@components/feedback'
import { Box, Flex, Grid, Text } from '@components/primitives'

import { ScrollableStory } from '@/storybook/ScrollableStory'

const meta = {
  argTypes: {
    align: {
      control: { type: 'select' },
      options: ['left', 'center', 'right']
    },
    bg: { control: false },
    children: { control: 'text' },
    color: { control: false },
    decoration: {
      control: { type: 'select' },
      options: ['underline', 'line-through', 'none']
    },
    leading: {
      control: { type: 'select' },
      options: ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose']
    },
    overflowWrap: {
      control: { type: 'select' },
      options: ['normal', 'break-word', 'anywhere']
    },
    size: {
      control: { type: 'select' },
      options: [
        'sm',
        'base',
        'lg',
        'xl',
        '2xl',
        '3xl',
        '4xl',
        '5xl',
        '6xl',
        '7xl',
        '8xl',
        '9xl'
      ]
    },
    tracking: {
      control: { type: 'select' },
      options: ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest']
    },
    transform: {
      control: { type: 'select' },
      options: ['uppercase', 'lowercase', 'capitalize', 'none']
    },
    weight: {
      control: { type: 'select' },
      options: ['normal', 'medium', 'semibold', 'bold']
    },
    whiteSpace: {
      control: { type: 'select' },
      options: [
        'normal',
        'nowrap',
        'pre',
        'pre-line',
        'pre-wrap',
        'break-spaces'
      ]
    },
    wordBreak: {
      control: { type: 'select' },
      options: ['normal', 'break-all', 'keep-all']
    },
    wrap: {
      control: { type: 'select' },
      options: ['wrap', 'nowrap', 'pretty', 'balance']
    }
  },
  component: Text
} satisfies Meta<typeof Text>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * The default `Text` renders an inline `<span>` in the base body size
 * without any explicit color — it inherits from the surrounding context.
 */
export const Default: Story = {
  args: {
    children: 'The quick brown fox jumps over the lazy dog.'
  },
  render: args => (
    <Flex align="center" height="100%" justify="center" p="3xl" width="100%">
      <Text {...args} />
    </Flex>
  )
}

/**
 * `size` maps to the design-system font-size tokens. From `'sm'` (0.875rem)
 * to `'9xl'` (8rem), all twelve steps are shown.
 */
export const FontSize: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      {(
        [
          'sm',
          'base',
          'lg',
          'xl',
          '2xl',
          '3xl',
          '4xl',
          '5xl',
          '6xl',
          '7xl',
          '8xl',
          '9xl'
        ] as const
      ).map(size => (
        <Flex key={size} align="baseline" gap="md">
          <Text
            as="code"
            color={{ base: 'bg-400', dark: 'bg-500' }}
            size="sm"
            style={{ flexShrink: 0, width: '3rem' }}
          >
            {size}
          </Text>
          <Text size={size}>Ag</Text>
        </Flex>
      ))}
    </ScrollableStory>
  )
}

/**
 * `weight` controls `font-weight` using design-system tokens.
 */
export const FontWeight: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      {(['normal', 'medium', 'semibold', 'bold'] as const).map(weight => (
        <Flex key={weight} align="center" gap="lg">
          <Text
            as="code"
            color={{ base: 'bg-400', dark: 'bg-500' }}
            size="sm"
            style={{ flexShrink: 0, width: '6rem' }}
          >
            {weight}
          </Text>
          <Text size="xl" weight={weight}>
            The quick brown fox
          </Text>
        </Flex>
      ))}
    </ScrollableStory>
  )
}

/**
 * `color` accepts either a flat `ColorToken` or a `ThemeConditionProp` map
 * for theme-adaptive and interactive colours. Named semantic shortcuts
 * `'default'`, `'muted'`, `'primary'`, and `'inherit'` are also supported.
 */
export const Color: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      <Text color="default" size="lg">
        color=&quot;default&quot; (bg-900 / bg-50 adaptive)
      </Text>
      <Text color="muted" size="lg">
        color=&quot;muted&quot; (bg-500 adaptive)
      </Text>
      <Text color="primary" size="lg">
        color=&quot;primary&quot; (custom-500 adaptive)
      </Text>
      <Text color="inherit" size="lg">
        color=&quot;inherit&quot;
      </Text>
      <Text color="bg-300" size="lg">
        color=&quot;bg-300&quot; (flat token)
      </Text>
      <Text color={{ base: 'bg-500', dark: 'bg-300' }} size="lg">
        {`color={{ base: 'bg-500', dark: 'bg-300' }} (adaptive)`}
      </Text>
      <Text
        color={{
          base: 'bg-500',
          dark: 'bg-300',
          darkHover: 'custom-400',
          hover: 'custom-500'
        }}
        size="lg"
        style={{ cursor: 'pointer' }}
      >
        color + hover + darkHover (hover me)
      </Text>
    </ScrollableStory>
  )
}

/**
 * `bg` sets a background colour on the text element itself, using the same
 * `ThemeConditionProp<ColorToken>` type as `color`. Useful for highlighted
 * or selected text runs.
 */
export const BackgroundColor: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      <Text bg="custom-500" color="bg-50" p="xs" size="lg">
        bg=&quot;custom-500&quot; (flat)
      </Text>
      <Text
        bg={{ base: 'bg-200', dark: 'bg-700' }}
        color={{ base: 'bg-900', dark: 'bg-50' }}
        p="xs"
        size="lg"
      >
        {`bg={{ base: 'bg-200', dark: 'bg-700' }} (adaptive)`}
      </Text>
    </ScrollableStory>
  )
}

/**
 * `align` sets `text-align`. All three values are shown.
 */
export const TextAlign: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      {(['left', 'center', 'right'] as const).map(align => (
        <Box
          key={align}
          bg={{ base: 'bg-50', dark: 'bg-800' }}
          p="md"
          rounded="lg"
          width="100%"
        >
          <Text align={align} as="p" size="lg">
            <code>align=&quot;{align}&quot;</code> — The quick brown fox jumps
            over the lazy dog.
          </Text>
        </Box>
      ))}
    </ScrollableStory>
  )
}

/**
 * `decoration` applies text-decoration: `'underline'`, `'line-through'`,
 * or `'none'` (removes any inherited decoration).
 */
export const TextDecoration: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      {(['underline', 'line-through', 'none'] as const).map(decoration => (
        <Text key={decoration} decoration={decoration} size="xl">
          <code>decoration=&quot;{decoration}&quot;</code> — The quick brown fox
        </Text>
      ))}
    </ScrollableStory>
  )
}

/**
 * `transform` applies text-transform. All four values are demonstrated.
 */
export const TextTransform: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      {(['uppercase', 'lowercase', 'capitalize', 'none'] as const).map(
        transform => (
          <Text key={transform} size="xl" transform={transform}>
            <code>transform=&quot;{transform}&quot;</code> — the quick brown fox
          </Text>
        )
      )}
    </ScrollableStory>
  )
}

/**
 * `truncate` (boolean shorthand) adds `overflow: hidden` + `text-overflow: ellipsis`
 * + `white-space: nowrap` in one prop. Must come before other props in JSX.
 */
export const Truncate: Story = {
  args: {},
  render: () => (
    <Flex align="center" height="100%" justify="center" p="3xl" width="100%">
      <Flex
        direction="column"
        gap="lg"
        style={{ maxWidth: '24rem' }}
        width="100%"
      >
        <Text
          as="p"
          color={{ base: 'bg-500', dark: 'bg-400' }}
          mb="xs"
          size="sm"
        >
          Without truncate:
        </Text>
        <Text as="p" size="lg">
          A very long piece of text that will wrap onto multiple lines inside
          the container.
        </Text>

        <Text
          as="p"
          color={{ base: 'bg-500', dark: 'bg-400' }}
          mb="xs"
          mt="sm"
          size="sm"
        >
          With truncate:
        </Text>
        <Text truncate as="p" size="lg">
          A very long piece of text that will be truncated with an ellipsis at
          the end of the line.
        </Text>
      </Flex>
    </Flex>
  )
}

/**
 * `lineClamp` limits the text to N lines with an ellipsis, using
 * `-webkit-line-clamp`. Numbers from 1 to 4 are shown.
 */
export const LineClamp: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      <Flex align="center" direction="column" gap="lg" justify="center">
        {[1, 2, 3, 4].map(n => (
          <Box
            key={n}
            bg={{ base: 'bg-50', dark: 'bg-800' }}
            maxWidth="32em"
            p="md"
            rounded="lg"
            width="100%"
          >
            <Text
              as="code"
              color={{ base: 'bg-400', dark: 'bg-500' }}
              mb="xs"
              size="sm"
            >
              lineClamp={n}
            </Text>
            <Text as="p" lineClamp={n} size="base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </Text>
          </Box>
        ))}
      </Flex>
    </ScrollableStory>
  )
}

/**
 * `whiteSpace` controls white-space handling. `'pre'` and `'pre-wrap'`
 * preserve newlines and spaces in the source text.
 */
export const WhiteSpace: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      {(['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap'] as const).map(
        ws => (
          <Box
            key={ws}
            bg={{ base: 'bg-50', dark: 'bg-800' }}
            overflow="hidden"
            p="md"
            rounded="lg"
          >
            <Text
              as="code"
              color={{ base: 'bg-400', dark: 'bg-500' }}
              mb="xs"
              size="sm"
            >
              whiteSpace=&quot;{ws}&quot;
            </Text>
            <Text as="p" size="base" whiteSpace={ws}>
              {`Line one\n  indented line two\nline three`}
            </Text>
          </Box>
        )
      )}
    </ScrollableStory>
  )
}

/**
 * Responsive `size` and `weight` use a breakpoint map to adjust typography
 * at different viewport widths.
 */
export const ResponsiveSize: Story = {
  args: {},
  render: () => (
    <Flex align="center" height="100%" justify="center" p="3xl" width="100%">
      <Flex direction="column" gap="md">
        <Text
          size={{ base: 'lg', lg: '4xl', md: '3xl', sm: '2xl' }}
          weight={{ base: 'normal', md: 'bold' }}
        >
          Responsive heading
        </Text>
        <Text color="muted" size={{ base: 'sm', md: 'base' }}>
          The font size and weight change at sm, md, and lg breakpoints.
        </Text>
      </Flex>
    </Flex>
  )
}

/**
 * `as` renders any HTML tag with full Text styling. Use semantic elements
 * like `<h1>`–`<h6>`, `<p>`, `<label>`, or `<abbr>`.
 */
export const PolymorphicElement: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      <Alert type="note">
        Open the browser dev tools to inspect the DOM structure of the given
        examples.
      </Alert>
      {(
        [
          { as: 'h1' as const, size: '4xl' as const, weight: 'bold' as const },
          {
            as: 'h2' as const,
            size: '3xl' as const,
            weight: 'semibold' as const
          },
          {
            as: 'h3' as const,
            size: '2xl' as const,
            weight: 'semibold' as const
          },
          {
            as: 'p' as const,
            size: 'base' as const,
            weight: 'normal' as const
          },
          {
            as: 'label' as const,
            size: 'sm' as const,
            weight: 'medium' as const
          }
        ] as const
      ).map(({ as: tag, size, weight }) => (
        <Text key={tag} as={tag} size={size} weight={weight}>
          &lt;{tag}&gt; — size=&quot;{size}&quot; weight=&quot;{weight}&quot;
        </Text>
      ))}
    </ScrollableStory>
  )
}

/**
 * `Text` composes naturally with other primitives. A typical card heading
 * with muted subtitle uses `color` and `size` props together.
 */
export const Composition: Story = {
  args: {},
  render: () => (
    <Flex align="center" height="100%" justify="center" p="3xl" width="100%">
      <Grid columns="repeat(2, minmax(0, 1fr))" gap="lg" width="100%">
        {[
          { tag: 'UI Kit', title: 'Design System', value: '128 components' },
          { tag: 'Backend', title: 'API Coverage', value: '97%' }
        ].map(({ tag, title, value }) => (
          <Box
            key={title}
            shadow
            bg={{ base: 'bg-50', dark: 'bg-900' }}
            p="lg"
            rounded="xl"
          >
            <Text
              color="primary"
              size="sm"
              transform="uppercase"
              weight="semibold"
            >
              {tag}
            </Text>
            <Text
              as="h3"
              color={{ base: 'bg-900', dark: 'bg-50' }}
              mt="xs"
              size="xl"
              weight="bold"
            >
              {title}
            </Text>
            <Text as="p" color="muted" mt="xs" size="sm">
              {value}
            </Text>
          </Box>
        ))}
      </Grid>
    </Flex>
  )
}

/**
 * `tracking` controls `letter-spacing` using a named scale from `'tighter'`
 * (-0.05em) to `'widest'` (0.1em).
 */
export const Tracking: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      {(['tighter', 'tight', 'normal', 'wide', 'wider', 'widest'] as const).map(
        tracking => (
          <Flex key={tracking} align="baseline" gap="md">
            <Text
              as="code"
              color={{ base: 'bg-400', dark: 'bg-500' }}
              size="sm"
              style={{ flexShrink: 0, width: '5rem' }}
            >
              {tracking}
            </Text>
            <Text size="lg" tracking={tracking}>
              The quick brown fox jumps over the lazy dog.
            </Text>
          </Flex>
        )
      )}
    </ScrollableStory>
  )
}

/**
 * `leading` overrides `line-height` with a named scale from `'none'` (1)
 * to `'loose'` (2), independent of the `size` prop.
 */
export const Leading: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      {(['none', 'tight', 'snug', 'normal', 'relaxed', 'loose'] as const).map(
        leading => (
          <Box
            key={leading}
            bg={{ base: 'bg-50', dark: 'bg-800' }}
            p="md"
            rounded="lg"
            width="100%"
          >
            <Text
              as="code"
              color={{ base: 'bg-400', dark: 'bg-500' }}
              display="block"
              mb="xs"
              size="sm"
            >
              leading=&quot;{leading}&quot;
            </Text>
            <Text as="p" leading={leading} size="base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text>
          </Box>
        )
      )}
    </ScrollableStory>
  )
}
