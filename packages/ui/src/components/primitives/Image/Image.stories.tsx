import type { Meta, StoryObj } from '@storybook/react-vite'

import { Box, Flex, Icon, Text } from '@/components/primitives'
import { surface } from '@/system'

import { Image, ZoomableImage } from './index'

const IMAGE_SRC = 'https://placehold.co/1200x675/png'
const PORTRAIT_SRC = 'https://placehold.co/600x900/png'

const meta = {
  args: {
    alt: 'Placeholder landscape',
    src: IMAGE_SRC
  },
  argTypes: {
    alt: { control: 'text' },
    decoding: {
      control: { type: 'select' },
      options: ['async', 'sync', 'auto']
    },
    fallback: { control: false },
    fit: {
      control: { type: 'select' },
      options: ['cover', 'contain', 'fill', 'none', 'scale-down']
    },
    loading: {
      control: { type: 'select' },
      options: ['lazy', 'eager']
    },
    objectPosition: { control: 'text' },
    src: { control: 'text' }
  },
  component: Image,
  title: 'Primitives/Image'
} satisfies Meta<typeof Image>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    alt: 'Placeholder landscape',
    src: IMAGE_SRC
  },
  render: args => (
    <Flex centered p="3xl" width="100%">
      <Box aspectRatio="16 / 9" overflow="hidden" r="lg" width="32em">
        <Image {...args} height="100%" width="100%" />
      </Box>
    </Flex>
  )
}

export const Fit: Story = {
  render: () => (
    <Flex align="start" gap="xl" p="3xl" wrap="wrap">
      {(['cover', 'contain', 'fill'] as const).map(fit => (
        <Flex key={fit} direction="column" gap="sm" width="14em">
          <Text transform="uppercase" weight="semibold">
            {fit}
          </Text>
          <Box aspectRatio="1" overflow="hidden" r="md">
            <Image
              alt=""
              fit={fit}
              height="100%"
              src={PORTRAIT_SRC}
              width="100%"
            />
          </Box>
        </Flex>
      ))}
    </Flex>
  )
}

export const Fallback: Story = {
  render: () => (
    <Flex centered p="3xl" width="100%">
      <Flex align="center" aspectRatio="1" justify="center" r="lg" width="12em">
        <Image alt="" height="100%" src="" width="100%" />
      </Flex>
    </Flex>
  )
}

export const Avatar: Story = {
  render: () => (
    <Flex centered gap="md" p="3xl">
      <Image
        alt="Profile picture"
        fit="cover"
        height="4em"
        r="full"
        src="https://placehold.co/200x200/png"
        width="4em"
      />
      <Image
        alt=""
        fallback={<Icon color="muted" icon="tabler:user" size="2em" />}
        fit="cover"
        height="4em"
        r="full"
        src=""
        width="4em"
      />
    </Flex>
  )
}

export const Framed: Story = {
  render: () => (
    <Flex centered p="3xl" width="100%">
      <Box shadow bg={surface.default} overflow="hidden" r="lg" width="24em">
        <Image
          alt="Placeholder landscape"
          aspectRatio="16 / 9"
          fit="cover"
          src={IMAGE_SRC}
          width="100%"
        />
        <Box p="md">
          <Text as="h2" size="xl" weight="semibold">
            Card with Image
          </Text>
          <Text as="p" color="muted" mt="sm">
            The image fills the frame with{' '}
            <Text as="code">fit=&quot;cover&quot;</Text>.
          </Text>
        </Box>
      </Box>
    </Flex>
  )
}

export const Zoomable: Story = {
  render: () => (
    <Flex centered p="3xl" width="100%">
      <Box aspectRatio="16 / 9" overflow="hidden" r="lg" width="32em">
        <ZoomableImage
          alt="Zoomable placeholder"
          fit="cover"
          height="100%"
          src={IMAGE_SRC}
          width="100%"
        />
      </Box>
    </Flex>
  )
}
