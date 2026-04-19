import type { Meta, StoryObj } from '@storybook/react-vite'

import { Alert } from '@components/feedback'
import { Box, Flex, type FlexProps, Grid, Text } from '@components/primitives'

import { ScrollableStory } from '@/storybook/ScrollableStory'
import { VariantContainer } from '@/storybook/VariantContainer'

const meta = {
  component: Grid,
  argTypes: {
    children: { control: false },
    bg: { control: false },
    display: {
      control: { type: 'select' },
      options: ['grid', 'inline-grid', 'none']
    },
    align: {
      control: { type: 'select' },
      options: ['stretch', 'center', 'start', 'end', 'baseline']
    },
    justify: {
      control: { type: 'select' },
      options: ['start', 'center', 'end', 'between']
    },
    flow: {
      control: { type: 'select' },
      options: ['row', 'column', 'dense', 'row dense', 'column dense']
    },
    gap: {
      control: { type: 'select' },
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']
    },
    rounded: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full']
    }
  }
} satisfies Meta<typeof Grid>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Cell({
  label,
  accent = false,
  noBg = false,
  children,
  ...props
}: {
  label?: string
  accent?: boolean
  noBg?: boolean
  children?: React.ReactNode
} & FlexProps) {
  return (
    <Flex
      align="center"
      bg={
        noBg
          ? undefined
          : {
              base: accent ? 'custom-200' : 'bg-200',
              dark: accent ? 'custom-700' : 'bg-700'
            }
      }
      justify="center"
      p="md"
      rounded="md"
      {...props}
    >
      {props.asChild
        ? children
        : label && (
            <Text color={{ base: 'bg-600', dark: 'bg-400' }} weight="medium">
              {label}
            </Text>
          )}
    </Flex>
  )
}

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * The default `Grid` renders a `display: grid` container. Without `columns`
 * the browser places children in a single column.
 */
export const Default: Story = {
  args: {
    gap: 'md',
    p: 'lg'
  },
  render: args => (
    <Flex align="center" height="100%" justify="center" p="3xl" width="100%">
      <Grid
        {...args}
        shadow
        bg={{ base: 'bg-50', dark: 'bg-900' }}
        columns="repeat(3, minmax(0, 1fr))"
        rounded="lg"
        width="100%"
      >
        <Cell label="1" />
        <Cell label="2" />
        <Cell label="3" />
        <Cell label="4" />
        <Cell label="5" />
        <Cell label="6" />
      </Grid>
    </Flex>
  )
}

/**
 * `columns` sets `grid-template-columns` as a CSS string. Use any valid
 * CSS value — fixed widths, `fr` fractions, `minmax()`, `auto`, or `repeat()`.
 */
export const Columns: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      {[
        { columns: 'repeat(2, minmax(0, 1fr))', label: '2 equal columns' },
        { columns: 'repeat(3, minmax(0, 1fr))', label: '3 equal columns' },
        { columns: 'repeat(4, minmax(0, 1fr))', label: '4 equal columns' },
        { columns: '200px 1fr 2fr', label: '200px · 1fr · 2fr' },
        {
          columns: 'repeat(auto-fill, minmax(8rem, 1fr))',
          label: 'auto-fill minmax(8rem, 1fr)'
        }
      ].map(({ columns, label }) => (
        <VariantContainer key={columns} title={`columns="${label}"`}>
          <Grid
            bg={{ base: 'bg-50', dark: 'bg-900' }}
            columns={columns}
            gap="sm"
            p="md"
            rounded="lg"
          >
            {['A', 'B', 'C', 'D', 'E', 'F'].map(c => (
              <Cell key={c} label={c} />
            ))}
          </Grid>
        </VariantContainer>
      ))}
    </ScrollableStory>
  )
}

/**
 * `rows` sets `grid-template-rows` as a CSS string. Combine with `columns`
 * to create a fully-defined two-dimensional grid.
 */
export const Rows: Story = {
  args: {},
  render: () => (
    <Flex align="center" height="100%" justify="center" p="3xl" width="100%">
      <Grid
        bg={{ base: 'bg-50', dark: 'bg-900' }}
        columns="repeat(3, minmax(0, 1fr))"
        gap="md"
        p="lg"
        rounded="lg"
        rows="5rem 8rem 5rem"
        width="100%"
      >
        <Cell label="5rem" />
        <Cell label="5rem" />
        <Cell label="5rem" />
        <Cell accent label="8rem" />
        <Cell accent label="8rem" />
        <Cell accent label="8rem" />
        <Cell label="5rem" />
        <Cell label="5rem" />
        <Cell label="5rem" />
      </Grid>
    </Flex>
  )
}

/**
 * `gap`, `gapX`, and `gapY` use design-system spacing tokens for consistent
 * gutters between grid cells.
 */
export const Gap: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      {(['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const).map(
        gap => (
          <VariantContainer key={gap} title={`gap="${gap}"`}>
            <Grid
              bg={{ base: 'bg-50', dark: 'bg-900' }}
              columns="repeat(4, minmax(0, 1fr))"
              gap={gap}
              p="md"
              rounded="lg"
            >
              {['A', 'B', 'C', 'D'].map(c => (
                <Cell key={c} label={c} />
              ))}
            </Grid>
          </VariantContainer>
        )
      )}
    </ScrollableStory>
  )
}

/**
 * `gapX` and `gapY` set column and row gap independently for
 * asymmetric gutters.
 */
export const IndependentGap: Story = {
  args: {},
  render: () => (
    <Flex align="center" height="100%" justify="center" p="3xl" width="100%">
      <Grid
        bg={{ base: 'bg-50', dark: 'bg-900' }}
        columns="repeat(3, minmax(0, 1fr))"
        gapX="xl"
        gapY="sm"
        p="lg"
        rounded="lg"
        width="100%"
      >
        {['A', 'B', 'C', 'D', 'E', 'F'].map(c => (
          <Cell key={c} label={c} />
        ))}
      </Grid>
    </Flex>
  )
}

/**
 * `align` maps to `align-items` (cross-axis alignment of cells within
 * their row track). All five values are demonstrated.
 */
export const Align: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      {(['stretch', 'start', 'center', 'end', 'baseline'] as const).map(
        align => (
          <VariantContainer key={align} title={`align="${align}"`}>
            <Grid
              align={align}
              bg={{ base: 'bg-50', dark: 'bg-900' }}
              columns="repeat(3, minmax(0, 1fr))"
              gap="sm"
              p="md"
              rounded="lg"
              style={{ minHeight: '6rem' }}
            >
              {['Short', 'Tall', 'Short'].map((label, i) => (
                <Cell
                  key={i}
                  accent={label === 'Tall'}
                  height={label === 'Tall' ? '8rem' : '5rem'}
                  label={label}
                />
              ))}
            </Grid>
          </VariantContainer>
        )
      )}
    </ScrollableStory>
  )
}

/**
 * `flow` controls `grid-auto-flow`. The `dense` packing algorithm can fill
 * in gaps left by spanning cells.
 */
export const Flow: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      {(
        [
          { flow: 'row' as const, label: 'flow="row" (default)' },
          { flow: 'column' as const, label: 'flow="column"' },
          { flow: 'dense' as const, label: 'flow="dense" (fills gaps)' }
        ] as const
      ).map(({ flow, label }) => (
        <VariantContainer key={flow} title={label}>
          <Grid
            bg={{ base: 'bg-50', dark: 'bg-900' }}
            columns="repeat(4, minmax(0, 1fr))"
            flow={flow}
            gap="sm"
            p="md"
            rounded="lg"
          >
            <Box
              bg={{ base: 'custom-100', dark: 'custom-900' }}
              gridColumn="span 2 / span 2"
              p="md"
              rounded="md"
            >
              <Text
                color={{ base: 'custom-700', dark: 'custom-300' }}
                size="sm"
              >
                span 2
              </Text>
            </Box>
            <Cell label="1" />
            <Cell label="2" />
            <Cell label="3" />
            <Cell label="4" />
            <Cell label="5" />
          </Grid>
        </VariantContainer>
      ))}
    </ScrollableStory>
  )
}

/**
 * Place `gridColumn` and `gridRow` on a wrapping `<Box>` child to span
 * multiple tracks. The Box primitive fully supports these props.
 */
export const SpanningCells: Story = {
  args: {},
  render: () => (
    <Flex align="center" height="100%" justify="center" p="3xl" width="100%">
      <Grid
        bg={{ base: 'bg-50', dark: 'bg-900' }}
        columns="repeat(3, minmax(0, 1fr))"
        gap="md"
        p="lg"
        rounded="lg"
        rows="repeat(3, 5rem)"
        width="100%"
      >
        <Cell
          accent
          gridColumn="span 2 / span 2"
          gridRow="span 2 / span 2"
          label="col-span-2 row-span-2"
        />
        <Cell label="1" />
        <Cell label="2" />
        <Cell label="3" />
        <Cell label="4" />
        <Cell label="5" />
      </Grid>
    </Flex>
  )
}

/**
 * `bg` and `shadow` turn `Grid` into a complete card/panel container.
 * Useful for dashboard sections and tile layouts.
 */
export const WithBackgroundAndShadow: Story = {
  args: {},
  render: () => (
    <Flex align="center" height="100%" justify="center" p="3xl" width="100%">
      <Grid
        shadow
        bg={{ base: 'bg-50', dark: 'bg-900' }}
        columns="repeat(3, minmax(0, 1fr))"
        gap="md"
        p="lg"
        rounded="xl"
        width="100%"
      >
        {[
          { title: 'Revenue', value: '$12,400' },
          { title: 'Users', value: '3,210' },
          { title: 'Orders', value: '842' }
        ].map(({ title, value }) => (
          <Box
            key={title}
            shadow
            bg={{ base: 'bg-100', dark: 'bg-800' }}
            p="lg"
            rounded="lg"
          >
            <Text as="p" color={{ base: 'bg-500', dark: 'bg-400' }} size="sm">
              {title}
            </Text>
            <Text as="p" size="2xl" weight="bold">
              {value}
            </Text>
          </Box>
        ))}
      </Grid>
    </Flex>
  )
}

/**
 * Responsive `columns` accepts a breakpoint map, enabling common responsive
 * grid patterns (1 col → 2 col → 3 col) with a single prop.
 */
export const ResponsiveColumns: Story = {
  args: {},
  render: () => (
    <Flex align="center" height="100%" justify="center" p="3xl" width="100%">
      <Grid
        bg={{ base: 'bg-50', dark: 'bg-900' }}
        columns={{
          base: 'repeat(1, minmax(0, 1fr))',
          sm: 'repeat(2, minmax(0, 1fr))',
          lg: 'repeat(3, minmax(0, 1fr))'
        }}
        gap="md"
        p="lg"
        rounded="xl"
        width="100%"
      >
        {['A', 'B', 'C', 'D', 'E', 'F'].map(c => (
          <Cell key={c} label={c} />
        ))}
      </Grid>
    </Flex>
  )
}

/**
 * `asChild` merges all Grid classes onto the single child element, removing
 * an extra DOM wrapper while preserving the full grid behaviour.
 */
export const AsChild: Story = {
  args: {},
  render: () => (
    <Flex align="center" height="100%" justify="center" p="3xl" width="100%">
      <Flex direction="column" gap="md" width="100%">
        <Alert type="note">
          Open the browser dev tools to inspect the DOM structure of the given
          examples.
        </Alert>
        <Grid
          asChild
          bg={{ base: 'bg-50', dark: 'bg-900' }}
          columns="repeat(3, minmax(0, 1fr))"
          gap="md"
          p="lg"
          rounded="xl"
          width="100%"
        >
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {['Alpha', 'Beta', 'Gamma'].map(item => (
              <Cell key={item} accent asChild label={item}>
                <li>{item}</li>
              </Cell>
            ))}
          </ul>
        </Grid>
      </Flex>
    </Flex>
  )
}
