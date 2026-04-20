import { Box, Flex, Text } from '@components/primitives';
import React from 'react'

function SliderTicks({ min = 0, max = 100 }: { min?: number; max?: number }) {
  return (
    <Flex
      justify="between"
      mb="md"
      style={{
        fontSize: '0.75rem',
        paddingLeft: '0.625rem',
        paddingRight: '0.625rem'
      }}
      width="100%"
    >
      {[min, ((min + max) / 2).toFixed(1), max].map((label, index) => (
        <Box
          key={`title-${label}-${index}`}
          bg={{ base: 'bg-300', dark: 'bg-700' }}
          position="relative"
          rounded="full"
          style={{ height: '0.5rem', width: '0.125rem' }}
        >
          <Text
            asChild
            color={{ base: 'bg-400', dark: 'bg-600' }}
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
      ))}
    </Flex>
  )
}

export default SliderTicks
