import { useContext } from 'react'
import { AutoSizer } from 'react-virtualized'

import { Flex, Scrollbar, Stack } from '@lifeforge/ui'

import { CategoriesBreakdownContext } from '..'
import BreakdownCategoryItem from './BreakdownCategoryItem'

function BreakdownDetails() {
  const { categories } = useContext(CategoriesBreakdownContext)

  return (
    <Flex height="100%" minHeight="24em" width="100%">
      <AutoSizer>
        {({ width, height }) => (
          <Scrollbar
            style={{
              width,
              height
            }}
          >
            <Stack gap="none">
              {categories.map(category => (
                <BreakdownCategoryItem key={category.id} category={category} />
              ))}
            </Stack>
          </Scrollbar>
        )}
      </AutoSizer>
    </Flex>
  )
}

export default BreakdownDetails
