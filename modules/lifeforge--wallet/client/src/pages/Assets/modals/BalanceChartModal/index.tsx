import dayjs from 'dayjs'
import { useState } from 'react'

import { Box, ModalHeader, Text } from '@lifeforge/ui'

import type { WalletAsset } from '@/hooks/useWalletData'

import BalanceChart from './components/BalanceChart'
import BalanceChartFilters from './components/BalanceChartFilters'

export const RANGE_MODE = [
  'week',
  'month',
  'quarter',
  'year',
  'all',
  'custom'
] as const

function BalanceChartModal({
  data: { initialData },
  onClose
}: {
  data: {
    initialData: WalletAsset
  }
  onClose: () => void
}) {
  const [rangeMode, setRangeMode] =
    useState<(typeof RANGE_MODE)[number]>('month')

  const [startDate, setStartDate] = useState<Date | null>(
    dayjs().subtract(1, 'month').toDate()
  )

  const [endDate, setEndDate] = useState<Date | null>(new Date())

  return (
    <Box minWidth="50vw">
      <ModalHeader
        appendTitle={
          <Text truncate display={{ base: 'none', sm: 'block' }}>
            {' '}
            - {initialData.name}
          </Text>
        }
        icon="tabler:chart-line"
        title="assetsBalanceChart"
        onClose={onClose}
      />
      <BalanceChartFilters
        endDate={endDate}
        rangeMode={rangeMode}
        setEndDate={setEndDate}
        setRangeMode={setRangeMode}
        setStartDate={setStartDate}
        startDate={startDate}
      />
      <BalanceChart
        asset={initialData}
        endDate={endDate}
        rangeMode={rangeMode}
        startDate={startDate}
      />
    </Box>
  )
}

export default BalanceChartModal
