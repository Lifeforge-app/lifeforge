import { useEffect } from 'react'
import { AutoSizer } from 'react-virtualized'

import {
  Box,
  EmptyStateScreen,
  Flex,
  Scrollbar,
  Stack,
  Text
} from '@lifeforge/ui'

import type { WalletCategory } from '../../..'
import { CategoriesTabbedView } from '../constants/tabbed_view'
import CategoryItem from './CategoryItem'

function CategoryList({ categories }: { categories: WalletCategory[] }) {
  const { currentTab, setAmounts } = CategoriesTabbedView.useContext()

  useEffect(() => {
    setAmounts({
      income: categories.filter(c => c.type === 'income').length,
      expenses: categories.filter(c => c.type === 'expenses').length
    })
  }, [categories, setAmounts])

  if (categories.length === 0) {
    return (
      <Flex centered flex="1">
        <EmptyStateScreen
          icon="tabler:apps-off"
          message={{
            id: 'categories'
          }}
        />
      </Flex>
    )
  }

  const filteredCategories = categories.filter(
    category => category.type === currentTab
  )

  return (
    <Box flex="1" mt="md">
      <AutoSizer>
        {({ width, height }) => (
          <Scrollbar style={{ width, height }}>
            <Stack>
              {filteredCategories.length > 0 ? (
                filteredCategories.map(category => (
                  <CategoryItem key={category.id} category={category} />
                ))
              ) : (
                <Text align="center" color="muted">
                  No {currentTab} categories found
                </Text>
              )}
            </Stack>
          </Scrollbar>
        )}
      </AutoSizer>
    </Box>
  )
}

export default CategoryList
