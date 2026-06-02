import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useRef } from 'react'

import { Box, Flex, Text } from '@/components/primitives'

import { PrintArea } from '.'

const meta = {
  argTypes: {
    children: { control: false },
    className: { control: 'text' },
    contentRef: { control: false },
    style: { control: 'object' }
  },
  component: PrintArea,
  title: 'Utilities/PrintArea'
} satisfies Meta<typeof PrintArea>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: null,
    contentRef: { current: null }
  },
  render: () => {
    const ref = useRef<HTMLDivElement | null>(null)

    return (
      <Flex align="center" direction="column" gap="md" p="3xl" width="100%">
        <Text size="lg" weight="semibold">
          PrintArea Component Demo
        </Text>
        <Text color={{ base: 'bg-500', dark: 'bg-400' }} size="sm">
          This component wraps printable content and dynamically clones design
          system variables and styles so they are preserved perfectly when
          printed.
        </Text>

        <Box
          shadow
          bg={{ base: 'bg-50', dark: 'bg-800' }}
          p="xl"
          r="lg"
          style={{ maxWidth: '28rem', width: '100%' }}
        >
          <PrintArea contentRef={ref}>
            <Flex direction="column" gap="md">
              <Flex justify="between">
                <Text size="lg" weight="semibold">
                  INVOICE
                </Text>
                <Text color="custom-500" weight="semibold">
                  #LF-8924
                </Text>
              </Flex>
              <Box
                style={{
                  borderBottom: '1px dashed var(--custom-color-bg-200)',
                  height: '1px'
                }}
              />
              <Flex direction="column" gap="xs">
                <Text size="sm">Date: June 2, 2026</Text>
                <Text size="sm">Billing to: Melvin Chia</Text>
              </Flex>
              <Box
                style={{
                  borderBottom: '1px dashed var(--custom-color-bg-200)',
                  height: '1px'
                }}
              />
              <Flex justify="between">
                <Text size="sm">1x Premium Subscription</Text>
                <Text size="sm">$12.00</Text>
              </Flex>
              <Flex justify="between">
                <Text size="sm">Taxes (10%)</Text>
                <Text size="sm">$1.20</Text>
              </Flex>
              <Box
                style={{
                  borderBottom: '1px solid var(--custom-color-bg-200)',
                  height: '1px'
                }}
              />
              <Flex justify="between">
                <Text weight="bold">Total Amount</Text>
                <Text weight="bold">$13.20</Text>
              </Flex>
            </Flex>
          </PrintArea>
        </Box>
      </Flex>
    )
  }
}
