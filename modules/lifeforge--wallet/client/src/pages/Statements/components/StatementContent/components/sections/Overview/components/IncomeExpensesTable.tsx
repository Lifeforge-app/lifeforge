import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useMemo } from 'react'

import { Flex, Icon, Text, colorWithOpacity } from '@lifeforge/ui'

import { useWalletData } from '@/hooks/useWalletData'
import { forgeAPI } from '@/manifest'
import numberToCurrency from '@/utils/numberToCurrency'

function IncomeExpensesTable({
  month,
  year,
  type
}: {
  month: number
  year: number
  type: 'income' | 'expenses'
}) {
  const { categoriesQuery } = useWalletData()

  const categories = categoriesQuery.data ?? []

  const prevMonth = useMemo(() => {
    const date = dayjs().year(year).month(month).subtract(1, 'month')

    return { month: date.month() + 1, year: date.year() }
  }, [month, year])

  const currentMonthQuery = useQuery(
    forgeAPI.analytics.getCategoriesBreakdown
      .input({ year: year.toString(), month: (month + 1).toString() })
      .queryOptions()
  )

  const prevMonthQuery = useQuery(
    forgeAPI.analytics.getCategoriesBreakdown
      .input({
        year: prevMonth.year.toString(),
        month: prevMonth.month.toString()
      })
      .queryOptions()
  )

  const currentBreakdown = currentMonthQuery.data?.[type] ?? {}

  const prevBreakdown = prevMonthQuery.data?.[type] ?? {}

  const currentTotal = useMemo(
    () =>
      Object.values(currentBreakdown).reduce(
        (acc, curr) => acc + curr.amount,
        0
      ),
    [currentBreakdown]
  )

  const prevTotal = useMemo(
    () =>
      Object.values(prevBreakdown).reduce((acc, curr) => acc + curr.amount, 0),
    [prevBreakdown]
  )

  const filteredCategories = useMemo(
    () =>
      categories
        .filter(category => category.type === type)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [categories, type]
  )

  return (
    <>
      <Text
        as="h2"
        mt="3xl"
        size={{ base: '2xl', print: 'lg' }}
        tracking="widest"
        transform="uppercase"
        weight="semibold"
      >
        <Text>1.{type === 'income' ? '2' : '3'} </Text>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Text>
      <table style={{ width: '100%', marginTop: '1.5rem', minWidth: '0' }}>
        <thead>
          <tr
            style={{
              backgroundColor: 'var(--color-custom-500)',
              color: 'white'
            }}
          >
            <th
              style={{
                width: '100%',
                padding: '0.75rem',
                textAlign: 'left',
                fontSize: '1.125rem',
                fontWeight: '500'
              }}
            >
              Category
            </th>
            <th
              style={{
                padding: '0.75rem',
                fontSize: '1.125rem',
                fontWeight: '500',
                whiteSpace: 'nowrap'
              }}
            >
              {dayjs()
                .year(prevMonth.year)
                .month(prevMonth.month - 1)
                .format('MMM YYYY')}
            </th>
            <th
              style={{
                padding: '0.75rem',
                fontSize: '1.125rem',
                fontWeight: '500',
                whiteSpace: 'nowrap'
              }}
            >
              {dayjs().year(year).month(month).format('MMM YYYY')}
            </th>
            <th
              colSpan={2}
              style={{
                padding: '0.75rem',
                fontSize: '1.125rem',
                fontWeight: '500',
                whiteSpace: 'nowrap'
              }}
            >
              Change
            </th>
          </tr>
          <tr
            style={{ backgroundColor: 'var(--color-bg-800)', color: 'white' }}
          >
            <th
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                textAlign: 'left',
                fontSize: '1.125rem',
                fontWeight: '500'
              }}
            ></th>
            <th
              style={{
                padding: '0.5rem 1rem',
                fontSize: '1.125rem',
                fontWeight: '500'
              }}
            >
              RM
            </th>
            <th
              style={{
                padding: '0.5rem 1rem',
                fontSize: '1.125rem',
                fontWeight: '500'
              }}
            >
              RM
            </th>
            <th
              style={{
                padding: '0.5rem 1rem',
                fontSize: '1.125rem',
                fontWeight: '500'
              }}
            >
              RM
            </th>
            <th
              style={{
                padding: '0.5rem 1rem',
                fontSize: '1.125rem',
                fontWeight: '500'
              }}
            >
              %
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((category, index) => {
            const currentAmount = currentBreakdown[category.id]?.amount ?? 0

            const prevAmount = prevBreakdown[category.id]?.amount ?? 0

            const change = currentAmount - prevAmount

            const isNegativeChange = type === 'income' ? change < 0 : change > 0

            return (
              <tr
                key={category.id}
                style={{
                  backgroundColor:
                    index % 2 === 0
                      ? colorWithOpacity('bg-500', '5%').toString()
                      : undefined
                }}
              >
                <td style={{ padding: '0.75rem', fontSize: '1.125rem' }}>
                  <Flex align="center" gap="sm">
                    <Icon
                      icon={category.icon}
                      size="1.5rem"
                      style={{ color: category.color }}
                    />
                    <Text whiteSpace="nowrap">{category.name}</Text>
                  </Flex>
                </td>
                <td
                  style={{
                    padding: '0.75rem',
                    textAlign: 'right',
                    fontSize: '1.125rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {numberToCurrency(prevAmount)}
                </td>
                <td
                  style={{
                    padding: '0.75rem',
                    textAlign: 'right',
                    fontSize: '1.125rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {numberToCurrency(currentAmount)}
                </td>
                <td
                  style={{
                    padding: '0.75rem',
                    textAlign: 'right',
                    fontSize: '1.125rem',
                    whiteSpace: 'nowrap',
                    color: isNegativeChange ? '#e11d48' : undefined
                  }}
                >
                  {change < 0
                    ? `(${numberToCurrency(Math.abs(change))})`
                    : numberToCurrency(change)}
                </td>
                <td
                  style={{
                    padding: '0.75rem',
                    textAlign: 'right',
                    fontSize: '1.125rem',
                    whiteSpace: 'nowrap',
                    color: isNegativeChange ? '#e11d48' : undefined
                  }}
                >
                  {Math.abs(prevAmount) < 0.001
                    ? '-'
                    : `${((change / prevAmount) * 100).toFixed(2)}%`}
                </td>
              </tr>
            )
          })}
          {(() => {
            const change = currentTotal - prevTotal

            const isNegativeChange = type === 'income' ? change < 0 : change > 0

            return (
              <tr>
                <td style={{ padding: '0.75rem', fontSize: '1.125rem' }}>
                  <Text size="xl" weight="semibold">
                    Total {type === 'income' ? 'Income' : 'Expenses'}
                  </Text>
                </td>
                <td
                  style={{
                    padding: '0.75rem',
                    textAlign: 'right',
                    fontSize: '1.125rem',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    borderTop: '2px solid',
                    borderBottom: '6px double'
                  }}
                >
                  {numberToCurrency(prevTotal)}
                </td>
                <td
                  style={{
                    padding: '0.75rem',
                    textAlign: 'right',
                    fontSize: '1.125rem',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    borderTop: '2px solid',
                    borderBottom: '6px double'
                  }}
                >
                  {numberToCurrency(currentTotal)}
                </td>
                <td
                  style={{
                    padding: '0.75rem',
                    textAlign: 'right',
                    fontSize: '1.125rem',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    borderTop: '2px solid',
                    borderBottom: '6px double',
                    color: isNegativeChange ? '#e11d48' : undefined
                  }}
                >
                  {change < 0
                    ? `(${numberToCurrency(Math.abs(change))})`
                    : numberToCurrency(change)}
                </td>
                <td
                  style={{
                    padding: '0.75rem',
                    textAlign: 'right',
                    fontSize: '1.125rem',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    borderTop: '2px solid',
                    borderBottom: '6px double',
                    color: isNegativeChange ? '#e11d48' : undefined
                  }}
                >
                  {Math.abs(prevTotal) < 0.001
                    ? '-'
                    : `${((change / prevTotal) * 100).toFixed(2)}%`}
                </td>
              </tr>
            )
          })()}
        </tbody>
      </table>
    </>
  )
}

export default IncomeExpensesTable
