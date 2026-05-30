import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ElementType } from 'react'

import { Alert } from '@/components/feedback'
import { Button } from '@/components/inputs'
import {
  Box,
  Flex,
  type FlexProps,
  Icon,
  Text,
  Transition
} from '@/components/primitives'
import { ScrollableStory } from '@/storybook/ScrollableStory'
import { VariantContainer } from '@/storybook/VariantContainer'
import { colorWithOpacity } from '@/system'

const meta = {
  argTypes: {
    align: {
      control: { type: 'select' },
      options: ['stretch', 'center', 'start', 'end', 'baseline']
    },
    bg: { control: false },
    children: { control: false },
    direction: {
      control: { type: 'select' },
      options: ['row', 'column', 'row-reverse', 'column-reverse']
    },
    display: {
      control: { type: 'select' },
      options: ['flex', 'inline-flex', 'none']
    },
    gap: {
      control: { type: 'select' },
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']
    },
    justify: {
      control: { type: 'select' },
      options: ['start', 'center', 'between', 'around', 'evenly', 'end']
    },
    rounded: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full']
    },
    wrap: {
      control: { type: 'select' },
      options: ['nowrap', 'wrap', 'wrap-reverse']
    }
  },
  component: Flex
} satisfies Meta<typeof Flex>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Item<T extends ElementType = 'div'>({
  accent = false,
  children,
  label,
  noBg = false,
  ...props
}: {
  label?: string
  accent?: boolean
  noBg?: boolean
  children?: React.ReactNode
} & FlexProps<T>) {
  return (
    <Transition>
      <Flex
        align="center"
        bg={
          noBg
            ? undefined
            : {
                base: accent ? 'custom-200' : 'bg-200',
                dark: accent ? 'custom-700' : 'bg-700',
                darkHover: 'bg-600',
                hover: 'bg-300'
              }
        }
        justify="center"
        p="md"
        r="md"
        {...(props as FlexProps<T>)}
      >
        {props.asChild
          ? children
          : label && (
              <Text color={{ base: 'bg-600', dark: 'bg-400' }} weight="medium">
                {label}
              </Text>
            )}
      </Flex>
    </Transition>
  )
}

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * The default `Flex` renders a horizontal flexbox row with `display: flex`.
 * With no additional props the children line up from the start edge.
 */
export const Default: Story = {
  args: {
    gap: 'md',
    p: 'lg'
  },
  render: args => (
    <Flex align="center" height="100%" justify="center" p="3xl" width="100%">
      <Flex
        {...args}
        shadow
        bg={{ base: 'bg-50', dark: 'bg-900' }}
        r="lg"
        width="100%"
      >
        <Item label="Item A" />
        <Item label="Item B" />
        <Item label="Item C" />
      </Flex>
    </Flex>
  )
}

/**
 * `direction` controls `flex-direction`. All four values are shown:
 * `row` (default), `column`, `row-reverse`, and `column-reverse`.
 */
export const Direction: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      {(['row', 'column', 'row-reverse', 'column-reverse'] as const).map(
        dir => (
          <VariantContainer key={dir} title={`direction="${dir}"`}>
            <Flex
              bg={{ base: 'bg-50', dark: 'bg-900' }}
              direction={dir}
              gap="sm"
              mt="sm"
              p="md"
              r="lg"
            >
              <Item label="A" />
              <Item label="B" />
              <Item label="C" />
            </Flex>
          </VariantContainer>
        )
      )}
    </ScrollableStory>
  )
}

/**
 * `align` maps to `align-items`, controlling cross-axis alignment.
 * The `baseline` value aligns to the text baseline - notice the different
 * font sizes aligning at their baseline.
 */
export const Align: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      {(['stretch', 'center', 'start', 'end', 'baseline'] as const).map(
        align => (
          <VariantContainer key={align} title={`align="${align}"`}>
            <Flex
              align={align}
              bg={{ base: 'bg-50', dark: 'bg-900' }}
              gap="sm"
              mt="sm"
              p="md"
              r="lg"
              style={{ minHeight: '5rem' }}
            >
              {['Short', 'Tall', 'Short'].map((label, i) => (
                <Item
                  key={label}
                  flex="1"
                  height={i === 1 ? '8rem' : 'auto'}
                  label={label}
                />
              ))}
            </Flex>
          </VariantContainer>
        )
      )}
    </ScrollableStory>
  )
}

/**
 * `justify` maps to `justify-content`, controlling main-axis distribution.
 */
export const Justify: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      {(['start', 'center', 'end', 'between', 'around', 'evenly'] as const).map(
        justify => (
          <VariantContainer key={justify} title={`justify="${justify}"`}>
            <Flex
              bg={{ base: 'bg-50', dark: 'bg-900' }}
              gap="sm"
              justify={justify}
              p="md"
              r="lg"
              width="100%"
            >
              <Item label="A" />
              <Item label="B" />
              <Item label="C" />
            </Flex>
          </VariantContainer>
        )
      )}
    </ScrollableStory>
  )
}

/**
 * `gap`, `gapX`, and `gapY` control the space between items using the
 * design-system spacing tokens.
 */
export const Gap: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      {(['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const).map(
        gap => (
          <VariantContainer key={gap} title={`gap="${gap}"`}>
            <Flex
              bg={{ base: 'bg-50', dark: 'bg-900' }}
              gap={gap}
              mt="sm"
              p="md"
              r="lg"
            >
              <Item label="A" />
              <Item label="B" />
              <Item label="C" />
            </Flex>
          </VariantContainer>
        )
      )}
    </ScrollableStory>
  )
}

/**
 * `gapX` and `gapY` set column and row gap independently. Useful in wrapped
 * flex layouts where you want different horizontal and vertical spacing.
 */
export const IndependentGap: Story = {
  args: {},
  render: () => (
    <Flex align="center" height="100%" justify="center" p="3xl" width="100%">
      <Flex
        bg={{ base: 'bg-50', dark: 'bg-900' }}
        gapX="xl"
        gapY="sm"
        p="lg"
        r="lg"
        style={{ maxWidth: '24rem' }}
        wrap="wrap"
      >
        {['A', 'B', 'C', 'D', 'E', 'F'].map(letter => (
          <Item key={letter} label={letter} />
        ))}
      </Flex>
    </Flex>
  )
}

/**
 * `wrap` controls `flex-wrap`. Use `"wrap"` to allow items to flow onto
 * the next line when the container is too narrow.
 */
export const Wrap: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      {(['nowrap', 'wrap', 'wrap-reverse'] as const).map(wrap => (
        <VariantContainer key={wrap} title={`wrap="${wrap}"`}>
          <Flex
            bg={{ base: 'bg-50', dark: 'bg-900' }}
            gap="sm"
            overflow="hidden"
            p="md"
            r="lg"
            style={{ maxWidth: '20rem' }}
            wrap={wrap}
          >
            {['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta'].map(
              item => (
                <Item key={item} label={item} />
              )
            )}
          </Flex>
        </VariantContainer>
      ))}
    </ScrollableStory>
  )
}

/**
 * `bg` and `shadow` work the same as on `Box`. Use `bg` for an adaptive
 * card background, `shadow` for the standard elevation shadow.
 */
export const WithBackgroundAndShadow: Story = {
  args: {},
  render: () => (
    <Flex direction="column" gap="lg" p="3xl" width="100%">
      <Flex
        shadow
        align="center"
        bg={{ base: 'bg-50', dark: 'bg-900' }}
        gap="md"
        p="lg"
        r="xl"
      >
        <Flex
          centered
          bg={colorWithOpacity('custom-500', '20%')}
          flexShrink="0"
          height="3em"
          r="md"
          width="3em"
        >
          <Icon color="custom-500" icon="tabler:cube" size="1.5em" />
        </Flex>
        <Box>
          <Text weight="semibold">Card title</Text>
          <Text as="p" color={{ base: 'bg-500', dark: 'bg-400' }} size="sm">
            A flex card with shadow and adaptive background color.
          </Text>
        </Box>
      </Flex>
    </Flex>
  )
}

/**
 * A common vertical layout pattern: a full-height column with a sticky
 * header, a scrollable content area, and a footer.
 */
export const ColumnLayout: Story = {
  args: {},
  render: () => (
    <Flex align="center" height="100%" justify="center" p="3xl" width="100%">
      <Flex
        shadow
        bg={{ base: 'bg-50', dark: 'bg-900' }}
        direction="column"
        overflow="hidden"
        r="xl"
        style={{ height: '20em', width: '20em' }}
      >
        <Flex
          align="center"
          bg={{ base: 'bg-100', dark: 'bg-800' }}
          justify="between"
          p="md"
        >
          <Text weight="semibold">Header</Text>
          <Button
            icon="tabler:pencil"
            iconStyle={{
              height: '1.1em',
              width: '1.1em'
            }}
            p="sm"
            variant="plain"
          >
            <Text size="sm">Edit</Text>
          </Button>
        </Flex>
        <Box overflow="auto" p="md" style={{ flex: '1 1 0' }}>
          <Text as="p" color={{ base: 'bg-500', dark: 'bg-400' }} size="sm">
            Scrollable content area. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Ut enim ad minim veniam.Lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
            enim ad minim veniam.Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam.Lorem ipsum dolor sit
            amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Ut enim ad minim veniam.
          </Text>
        </Box>
        <Flex
          align="center"
          bg={{ base: 'bg-100', dark: 'bg-800' }}
          gap="sm"
          justify="end"
          p="md"
        >
          <Text color={{ base: 'bg-500', dark: 'bg-400' }} size="sm">
            Footer
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

/**
 * `flexGrow`, `flexShrink`, and `flexBasis` let child boxes participate
 * in the flex algorithm explicitly.
 */
export const FlexChildProps: Story = {
  args: {},
  render: () => (
    <Flex align="center" height="100%" justify="center" p="3xl" width="100%">
      <Flex
        bg={{ base: 'bg-50', dark: 'bg-900' }}
        gap="sm"
        p="md"
        r="lg"
        width="100%"
      >
        <Box
          bg={{ base: 'bg-200', dark: 'bg-700' }}
          flexShrink="0"
          p="md"
          r="md"
          style={{ width: '6rem' }}
        >
          <Text size="sm">shrink=0</Text>
        </Box>

        <Box
          bg={{ base: 'custom-100', dark: 'custom-900' }}
          flexGrow="1"
          p="md"
          r="md"
        >
          <Text size="sm">grow=1 (fills remaining space)</Text>
        </Box>

        <Box
          bg={{ base: 'bg-200', dark: 'bg-700' }}
          flexShrink="0"
          p="md"
          r="md"
          style={{ width: '6rem' }}
        >
          <Text size="sm">shrink=0</Text>
        </Box>
      </Flex>
    </Flex>
  )
}

/**
 * `Flex` can render as any HTML element via `as`. Useful for semantic
 * layouts where the element type matters (e.g. `<nav>`, `<ul>`, `<form>`).
 */
export const PolymorphicElement: Story = {
  args: {},
  render: () => (
    <Flex align="center" height="100%" justify="center" p="3xl" width="100%">
      <Flex direction="column" gap="md" width="100%">
        <Alert type="note">
          Open the browser dev tools to inspect the DOM structure of the given
          examples.
        </Alert>
        <Flex
          align="center"
          as="nav"
          bg={{ base: 'bg-50', dark: 'bg-800' }}
          gap="md"
          p="md"
          r="xl"
          width="100%"
        >
          {['Home', 'About', 'Work', 'Contact'].map(item => (
            <Item
              key={item}
              as="a"
              href="https://docs.lifeforge.dev"
              label={item}
            />
          ))}
        </Flex>
      </Flex>
    </Flex>
  )
}

/**
 * `asChild` merges all Flex classes onto the single child element -
 * no extra DOM node is added.
 */
export const AsChild: Story = {
  args: {},
  render: () => (
    <Flex direction="column" gap="md">
      <Alert type="note">
        Open the browser dev tools to inspect the DOM structure of the given
        examples.
      </Alert>
      <Flex
        asChild
        shadow
        align="center"
        bg={{ base: 'bg-50', dark: 'bg-900' }}
        gap="md"
        p="lg"
        r="xl"
      >
        <form>
          <Item
            asChild
            shadow
            bg={{ base: 'bg-100', dark: 'bg-800' }}
            p="md"
            r="md"
          >
            <input placeholder="Enter your name" type="text" />
          </Item>
          <Item
            asChild
            shadow
            bg={{ base: 'bg-100', dark: 'bg-800' }}
            p="md"
            r="md"
          >
            <input placeholder="Enter your email" type="email" />
          </Item>
          <Item asChild noBg>
            <Button icon="tabler:arrow-right" iconPosition="end">
              Submit
            </Button>
          </Item>
        </form>
      </Flex>
    </Flex>
  )
}
