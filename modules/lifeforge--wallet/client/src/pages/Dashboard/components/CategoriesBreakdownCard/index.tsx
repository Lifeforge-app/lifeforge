import { createContext, useState } from 'react'
import { Link } from 'react-router'

import type { InferOutput } from '@lifeforge/api'
import { Button, Icon, Widget } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { WalletCategory } from '../../../Transactions'
import BreakdownContent from './components/BreakdownContent'

type CategoryBreakdown = InferOutput<
  typeof forgeAPI.analytics.getCategoriesBreakdown
>['income']

export const CategoriesBreakdownContext = createContext<{
  breakdown: CategoryBreakdown
  categories: WalletCategory[]
  type: 'income' | 'expenses'
  year: number | null
  month: number | null
}>({
  breakdown: {},
  categories: [],
  type: 'expenses',
  year: null,
  month: null
})

function CategoriesBreakdownCard() {
  const [selectedType, setSelectedType] = useState<'income' | 'expenses'>(
    'expenses'
  )

  return (
    <Widget
      actionComponent={
        <Button
          as={Link}
          p="xs"
          to={`/wallet/transactions?type=${selectedType}`}
          variant="plain"
        >
          <Icon icon="tabler:chevron-right" />
        </Button>
      }
      gridColumnSpan={1}
      gridRowSpan={6}
      height="100%"
      icon="tabler:chart-donut-3"
      minHeight="0"
      title="Categories Breakdown"
    >
      <BreakdownContent
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />
    </Widget>
  )
}

export default CategoriesBreakdownCard
