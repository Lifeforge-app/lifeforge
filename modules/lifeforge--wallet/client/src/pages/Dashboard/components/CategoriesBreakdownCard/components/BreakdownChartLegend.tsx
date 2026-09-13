import { useContext } from 'react'

import { Box, Flex, Text } from '@lifeforge/ui'

import { CategoriesBreakdownContext } from '..'

function BreakdownChartLegend() {
  const { categories } = useContext(CategoriesBreakdownContext)

  return (
    <Flex align="center" gapX="lg" gapY="sm" justify="center" wrap="wrap">
      {categories.map(category => (
        <Flex key={category.id} align="center" gap="sm">
          <Box
            height="0.75rem"
            r="full"
            style={{
              backgroundColor: category.color + '30',
              border: `1px solid ${category.color}`
            }}
            width="0.75rem"
          />
          <Text size="sm">{category.name}</Text>
        </Flex>
      ))}
    </Flex>
  )
}

export default BreakdownChartLegend
