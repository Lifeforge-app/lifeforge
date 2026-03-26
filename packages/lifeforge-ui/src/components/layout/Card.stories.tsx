import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@components/inputs'
import { Box, Flex, Grid, Text } from '@components/primitives'

import Card from './Card'

const meta = {
  component: Card,
  argTypes: {
    children: {
      control: false,
      table: {
        type: {
          summary: 'React.ReactNode'
        }
      }
    },
    as: {
      control: false,
      table: {
        type: {
          summary: 'React.ElementType'
        }
      }
    }
  }
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: <Box p="md">This is a card</Box>
  },
  render: args => (
    <Box p="xl" width="24rem">
      <Card {...args} />
    </Box>
  )
}

export const Interactive: Story = {
  args: {
    isInteractive: true,
    children: <Box p="md">Click or hover me!</Box>
  },
  render: args => (
    <Box p="xl" width="24rem">
      <Card {...args} />
    </Box>
  )
}

export const AsButton: Story = {
  args: {
    as: 'button',
    isInteractive: true,
    children: <Box p="md">I&apos;m a button card</Box>,
    onClick: () => alert('Button clicked!')
  },
  render: args => (
    <Box p="xl" width="24rem">
      <Card {...args} />
    </Box>
  )
}

export const AsLink: Story = {
  args: {
    as: 'a',
    isInteractive: true,
    href: 'https://docs.lifeforge.dev',
    children: <Box p="md">I&apos;m a link card</Box>,
    rel: 'noopener noreferrer',
    target: '_blank'
  },
  render: args => (
    <Box p="xl" width="24rem">
      <Card {...args} />
    </Box>
  )
}

export const MultipleItems: Story = {
  args: {
    children: <></>
  },
  render: () => (
    <Grid columns="repeat(2, minmax(0, 1fr))" gap="md" p="xl">
      <Card>
        <Box p="md">Item 1</Box>
      </Card>
      <Card isInteractive>
        <Box p="md">Item 2 (Interactive)</Box>
      </Card>
      <Card>
        <Box p="md">Item 3</Box>
      </Card>
      <Card isInteractive>
        <Box p="md">Item 4 (Interactive)</Box>
      </Card>
    </Grid>
  )
}

export const WithTitle: Story = {
  args: {
    children: <></>
  },
  render: () => (
    <Box p="xl" style={{ width: '20rem' }}>
      <Card>
        <Box p="md">
          <Text as="h2" mb="sm" size="xl" weight="semibold">
            Card Title
          </Text>
          <Text as="p" color="bg-500">
            This is an example of an card styled as a card with shadow.
          </Text>
        </Box>
      </Card>
    </Box>
  )
}

export const WithImage: Story = {
  args: {
    children: <></>
  },
  render: () => (
    <Flex align="center" justify="center" p="xl" style={{ width: '60vw' }}>
      <Card style={{ padding: 0, width: '24rem' }}>
        <img
          alt="Card Image"
          src="https://placehold.co/1600x900/png"
          style={{
            aspectRatio: '16 / 9',
            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
            objectFit: 'cover',
            width: '100%'
          }}
        />
        <Box p="md">
          <Text as="h2" mb="sm" size="xl" weight="semibold">
            Card with Image
          </Text>
          <Text as="p" color="bg-500">
            This card includes an image at the top to enhance visual appeal.
          </Text>
        </Box>
      </Card>
    </Flex>
  )
}

export const WithImageAndButton: Story = {
  args: {
    children: <></>
  },
  render: () => (
    <Flex align="center" justify="center" p="xl" style={{ width: '60vw' }}>
      <Card style={{ padding: 0, width: '24rem' }}>
        <img
          alt="Card Image"
          src="https://placehold.co/1600x900/png"
          style={{
            aspectRatio: '16 / 9',
            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
            objectFit: 'cover',
            width: '100%'
          }}
        />
        <Box p="md">
          <Text as="h2" mb="sm" size="xl" weight="semibold">
            Card with Image &amp; Button
          </Text>
          <Text as="p" color="bg-500" mb="md">
            This card includes an image and a call-to-action button.
          </Text>
          <Button
            icon="tabler:arrow-right"
            iconPosition="end"
            style={{ width: '100%' }}
            variant="secondary"
          >
            Learn More
          </Button>
        </Box>
      </Card>
    </Flex>
  )
}
