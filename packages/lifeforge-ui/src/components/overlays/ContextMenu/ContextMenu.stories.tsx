import { Icon } from '@iconify/react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Box, Flex, Text } from '@components/primitives'

import ContextMenuGroup from './components/ContextMenuGroup'
import ContextMenuItem from './components/ContextMenuItem'
import Index from './index'
import ContextMenu from './index'

const meta = {
  argTypes: {
    children: {
      control: false
    }
  },
  component: Index
} satisfies Meta<typeof Index>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: <></>
  },
  render: () => (
    <Box px="3xl" width="100%">
      <Box
        shadow
        bg={{ base: 'bg-50', dark: 'bg-900' }}
        height="100%"
        p="md"
        rounded="lg"
        width="100%"
      >
        <Flex align="center" justify="between">
          <Flex align="center" style={{ gap: '0.75rem' }}>
            <Box
              p="sm"
              rounded="md"
              style={{
                backgroundColor:
                  'color-mix(in srgb, var(--color-custom-500) 30%, transparent)'
              }}
            >
              <Icon
                icon="tabler:cube"
                style={{
                  color: 'var(--color-custom-500)',
                  height: '1.5rem',
                  width: '1.5rem'
                }}
              />
            </Box>
            <Text as="h1" size="2xl" weight="medium">
              Something Cool
            </Text>
          </Flex>
          <ContextMenu>
            <ContextMenuItem
              icon="tabler:pencil"
              label="Edit"
              onClick={() => {}}
            />
            <ContextMenuItem
              dangerous
              icon="tabler:trash"
              label="Delete"
              onClick={() => {}}
            />
          </ContextMenu>
        </Flex>
        <Text as="p" color="muted" mt="md">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Text>
      </Box>
    </Box>
  )
}

export const WithGroup: Story = {
  args: {
    children: (
      <>
        <ContextMenuGroup icon="tabler:eye" label="View">
          <ContextMenuItem icon="tabler:list" label="List" onClick={() => {}} />
          <ContextMenuItem
            checked
            icon="tabler:category-2"
            label="Grid"
            onClick={() => {}}
          />
        </ContextMenuGroup>
        <ContextMenuItem
          dangerous
          icon="tabler:trash"
          label="Delete"
          onClick={() => {}}
        />
      </>
    )
  }
}

export const CustomAnchor: Story = {
  args: {
    align: 'end',
    children: (
      <>
        <ContextMenuItem icon="tabler:pencil" label="Edit" onClick={() => {}} />
        <ContextMenuItem
          dangerous
          icon="tabler:trash"
          label="Delete"
          onClick={() => {}}
        />
      </>
    ),
    side: 'right'
  }
}

export const CustomIcon: Story = {
  args: {
    children: (
      <>
        <ContextMenuItem
          icon="tabler:file-text"
          label="Documents"
          onClick={() => {}}
        />
        <ContextMenuItem
          icon="tabler:photo"
          label="Pictures"
          onClick={() => {}}
        />
        <ContextMenuItem
          icon="tabler:video"
          label="Videos"
          onClick={() => {}}
        />
      </>
    ),
    customIcon: 'tabler:upload'
  }
}
