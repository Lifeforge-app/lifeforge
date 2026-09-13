import dayjs from 'dayjs'
import { useContext, useMemo } from 'react'
import { Link } from 'react-router'

import { useModuleTranslation } from '@lifeforge/localization'
import { Box, Flex, Icon, Stack, Text, WithDivide } from '@lifeforge/ui'

import type { WalletCategory } from '@/hooks/useWalletData'
import { useWalletStore } from '@/stores/useWalletStore'

import { CategoriesBreakdownContext } from '..'
import numberToCurrency from '../../../../../utils/numberToCurrency'

function BreakdownCategoryItem({ category }: { category: WalletCategory }) {
  const { t } = useModuleTranslation()
  const { isAmountHidden } = useWalletStore()
  const { breakdown, type, year, month } = useContext(
    CategoriesBreakdownContext
  )

  const filterParams = useMemo(() => {
    if (year === null || month === null)
      return `?type=${type}&category=${category.id}`

    const startDate = dayjs()
      .year(year)
      .month(month)
      .startOf('month')
      .format('YYYY-MM-DD')
    const endDate = dayjs()
      .year(year)
      .month(month)
      .endOf('month')
      .format('YYYY-MM-DD')

    return `?type=${type}&startDate=${startDate}&endDate=${endDate}&category=${category.id}`
  }, [year, month, type, category.id])

  return (
    <WithDivide
      key={category.id}
      axis="y"
      color={{ base: 'bg-200', dark: 'bg-800' }}
    >
      <Flex
        as={Link}
        bg={{
          base: 'transparent',
          hover: 'bg-100',
          darkHover: 'bg-800'
        }}
        gap="lg"
        minWidth="0"
        p="lg"
        to={`/wallet/transactions${filterParams}`}
        width="100%"
      >
        <Flex align="center" gap="md" minWidth="0" width="100%">
          <Box
            p="sm"
            r="md"
            style={{
              backgroundColor: category.color + '20',
              color: category.color
            }}
          >
            <Icon icon={category.icon} size="1.5rem" />
          </Box>
          <Stack gap="none" minWidth="0">
            <Text truncate weight="semibold">
              {category.name}
            </Text>
            <Text color="muted" size="sm" whiteSpace="nowrap">
              {breakdown[category.id]?.count} {t('transactionCount')}
            </Text>
          </Stack>
        </Flex>
        <Stack align="end" flexShrink="0" gap="none" width="min-content">
          <Flex align={isAmountHidden ? 'center' : 'end'} gap="sm">
            <Text
              color={type === 'income' ? 'green-500' : 'red-500'}
              weight="medium"
              whiteSpace="nowrap"
            >
              {type === 'income' ? '+' : '-'} RM{' '}
              {isAmountHidden ? (
                <Flex align="center" display="inline-flex">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <Icon key={i} icon="uil:asterisk" size="1rem" />
                    ))}
                </Flex>
              ) : (
                numberToCurrency(breakdown[category.id]?.amount)
              )}
            </Text>
          </Flex>
          <Text align="right" color="muted" size="sm">
            {breakdown[category.id]?.percentage.toFixed(2)}%
          </Text>
        </Stack>
      </Flex>
    </WithDivide>
  )
}

export default BreakdownCategoryItem
