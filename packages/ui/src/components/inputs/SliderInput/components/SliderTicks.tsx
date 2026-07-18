import React from 'react'

import { Box, Flex, Text } from '@/components/primitives'

export function SliderTicks({
  min = 0,
  max = 100,
  renderValue
}: {
  min?: number
  max?: number
  renderValue?: (value: number) => string
}) {
  return (
    <Flex justify="between" mb="md" px="sm">
      {[min, (min + max) / 2, max].map((tick, index) => {
        const label = renderValue
          ? renderValue(tick)
          : index === 1
            ? tick.toFixed(1)
            : tick

        return (
          <Box
            key={`title-${label}-${index}`}
            bg={{ base: 'bg-300', dark: 'bg-700' }}
            position="relative"
            r="full"
            style={{ height: '0.5rem', width: '0.125rem' }}
          >
            <Text
              asChild
              color={{ base: 'bg-400', dark: 'bg-600' }}
              size="sm"
              weight="medium"
            >
              <Box
                position="absolute"
                style={{
                  bottom: '-1.25rem',
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}
              >
                {label}
              </Box>
            </Text>
          </Box>
        )
      })}
    </Flex>
  )
}
