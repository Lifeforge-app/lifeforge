import { useContext, useMemo } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import { useModuleTranslation } from '@lifeforge/localization'
import { Bordered, Box, Flex, Icon, Stack, Text, surface } from '@lifeforge/ui'

import { useWalletStore } from '@/stores/useWalletStore'
import numberToCurrency from '@/utils/numberToCurrency'

import { CategoriesBreakdownContext } from '..'

function BreakdownDoughnutChart() {
  const { t } = useModuleTranslation()
  const { isAmountHidden } = useWalletStore()
  const { breakdown, categories, type } = useContext(CategoriesBreakdownContext)

  const chartData = useMemo(() => {
    return categories.map(category => ({
      name: category.name,
      value: breakdown?.[category.id]?.amount || 0,
      color: category.color
    }))
  }, [categories, breakdown])

  const totalAmount = useMemo(() => {
    return Object.values(breakdown).reduce((acc, curr) => acc + curr.amount, 0)
  }, [breakdown])

  const CustomTooltip = ({
    active,
    payload
  }: {
    active?: boolean
    payload?: Array<{
      value: number
      name: string
      payload: { name: string; value: number; color: string }
    }>
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0]

      const percentage = totalAmount > 0 ? (data.value / totalAmount) * 100 : 0

      return (
        <Bordered asChild borderColor={{ base: 'bg-200', dark: 'bg-700' }}>
          <Stack bg={surface.light} p="lg" r="lg">
            <Flex align="center" gap="sm">
              <Box
                height="0.625rem"
                r="full"
                style={{ backgroundColor: data.payload.color }}
                width="0.625rem"
              />
              <Text weight="medium">{data.name}</Text>
            </Flex>
            <Flex align="center" gap="lg" justify="between" mt="sm">
              <Text color="muted">Amount:</Text>
              <Text style={{ color: data.payload.color }} weight="semibold">
                RM {numberToCurrency(data.value)}
              </Text>
            </Flex>
            <Flex align="center" gap="lg" justify="between">
              <Text color="muted">Percentage:</Text>
              <Text weight="semibold">{percentage.toFixed(1)}%</Text>
            </Flex>
          </Stack>
        </Bordered>
      )
    }

    return null
  }

  return (
    <Flex
      centered
      aspectRatio="1/1"
      direction="column"
      gap="md"
      height="auto"
      minWidth="0"
      position="relative"
      width="80%"
    >
      <Flex
        centered
        align="center"
        direction="column"
        height="100%"
        inset="0"
        left="50%"
        mt="sm"
        position="absolute"
        style={{
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%)'
        }}
        top="50%"
        width="100%"
      >
        <Flex asChild align={isAmountHidden ? 'center' : 'end'}>
          <Text weight="medium">
            <Text color="muted" mr="xs" size="xl">
              RM
            </Text>
            {isAmountHidden ? (
              <Flex align="center">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Icon
                      key={i}
                      icon="uil:asterisk"
                      size={{ base: '1.5rem', sm: '2rem' }}
                    />
                  ))}
              </Flex>
            ) : (
              <Text size="3xl" weight="medium">
                {numberToCurrency(totalAmount)}
              </Text>
            )}
          </Text>
        </Flex>
        <Text
          align="center"
          color="muted"
          mt="sm"
          size={{ base: 'sm', sm: 'base' }}
        >
          {type === 'expenses'
            ? t('widgets.categoriesBreakdown.thisMonthsExpenses')
            : t('widgets.categoriesBreakdown.thisMonthsIncome')}
        </Text>
      </Flex>
      <Flex height="100%" maxWidth="36em" width="100%">
        <ResponsiveContainer height="100%" width="100%">
          <PieChart>
            <Pie
              cornerRadius={4}
              cx="50%"
              cy="50%"
              data={chartData}
              dataKey="value"
              innerRadius="80%"
              nameKey="name"
              outerRadius="100%"
              paddingAngle={2}
              strokeWidth={1}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color + '20'}
                  stroke={entry.color}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </Flex>
    </Flex>
  )
}

export default BreakdownDoughnutChart
