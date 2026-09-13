import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'

import { Flex, Icon, Text, WithQuery, colorWithOpacity } from '@lifeforge/ui'

import { useWalletData } from '@/hooks/useWalletData'
import { forgeAPI } from '@/manifest'
import numberToCurrency from '@/utils/numberToCurrency'

function AssetsTable({ month, year }: { month: number; year: number }) {
  const { assetsQuery } = useWalletData()

  const balancesQuery = useQuery(
    forgeAPI.assets.getAllAssetAccumulatedBalance
      .input({
        year: year.toString(),
        month: (month + 1).toString()
      })
      .queryOptions()
  )

  return (
    <WithQuery query={assetsQuery}>
      {assets => (
        <WithQuery query={balancesQuery}>
          {balances => (
            <table
              style={{ width: '100%', marginTop: '1.5rem', minWidth: '0' }}
            >
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
                    Assets
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
                      .month(month - 1)
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
                    {dayjs().month(month).format('MMM YYYY')}
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
                  style={{
                    backgroundColor: 'var(--color-bg-800)',
                    color: 'white'
                  }}
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
                {(() => {
                  const sorted = assets.sort((a, b) =>
                    a.name.localeCompare(b.name)
                  )

                  const totals = sorted.reduce(
                    (acc, asset) => {
                      const balance = balances[asset.id]

                      if (balance) {
                        acc.last += balance.last
                        acc.current += balance.current
                      }

                      return acc
                    },
                    { last: 0, current: 0 }
                  )

                  const totalChange = totals.current - totals.last
                  const totalPercentage =
                    totals.last !== 0 ? (totalChange / totals.last) * 100 : 0

                  return (
                    <>
                      {sorted.map((asset, index) => {
                        const assetBalance = balances[asset.id]

                        const change = assetBalance.current - assetBalance.last

                        const percentage =
                          assetBalance.last !== 0
                            ? (change / assetBalance.last) * 100
                            : 0

                        return (
                          <tr
                            key={asset.id}
                            style={{
                              backgroundColor:
                                index % 2 === 0
                                  ? colorWithOpacity('bg-500', '5%').toString()
                                  : undefined
                            }}
                          >
                            <td
                              style={{
                                padding: '0.75rem',
                                fontSize: '1.125rem'
                              }}
                            >
                              <Flex align="center" gap="sm">
                                <Icon icon={asset.icon} size="1.5rem" />
                                <Text whiteSpace="nowrap">{asset.name}</Text>
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
                              {balancesQuery.isLoading
                                ? '...'
                                : numberToCurrency(assetBalance.last)}
                            </td>
                            <td
                              style={{
                                padding: '0.75rem',
                                textAlign: 'right',
                                fontSize: '1.125rem',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {balancesQuery.isLoading
                                ? '...'
                                : numberToCurrency(assetBalance.current)}
                            </td>
                            <td
                              style={{
                                padding: '0.75rem',
                                textAlign: 'right',
                                fontSize: '1.125rem',
                                whiteSpace: 'nowrap',
                                color: change < 0 ? '#e11d48' : undefined
                              }}
                            >
                              {balancesQuery.isLoading
                                ? '...'
                                : change < 0
                                  ? `(${numberToCurrency(Math.abs(change))})`
                                  : numberToCurrency(change)}
                            </td>
                            <td
                              style={{
                                padding: '0.75rem',
                                textAlign: 'right',
                                fontSize: '1.125rem',
                                whiteSpace: 'nowrap',
                                color: percentage < 0 ? '#e11d48' : undefined
                              }}
                            >
                              {balancesQuery.isLoading
                                ? '...'
                                : percentage < 0
                                  ? `(${Math.abs(percentage).toFixed(2)}%)`
                                  : `${percentage.toFixed(2)}%`}
                            </td>
                          </tr>
                        )
                      })}
                      <tr>
                        <td
                          style={{
                            padding: '0.75rem',
                            fontSize: '1.125rem'
                          }}
                        >
                          <Text size="xl" weight="semibold">
                            Total Assets
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
                          {balancesQuery.isLoading
                            ? '...'
                            : numberToCurrency(totals.last)}
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
                          {balancesQuery.isLoading
                            ? '...'
                            : numberToCurrency(totals.current)}
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
                            color: totalChange < 0 ? '#e11d48' : undefined
                          }}
                        >
                          {balancesQuery.isLoading
                            ? '...'
                            : totalChange < 0
                              ? `(${numberToCurrency(Math.abs(totalChange))})`
                              : numberToCurrency(totalChange)}
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
                            color: totalPercentage < 0 ? '#e11d48' : undefined
                          }}
                        >
                          {balancesQuery.isLoading
                            ? '...'
                            : Math.abs(totals.last) < 0.001
                              ? '-'
                              : totalPercentage < 0
                                ? `(${Math.abs(totalPercentage).toFixed(2)}%)`
                                : `${totalPercentage.toFixed(2)}%`}
                        </td>
                      </tr>
                    </>
                  )
                })()}
              </tbody>
            </table>
          )}
        </WithQuery>
      )}
    </WithQuery>
  )
}

export default AssetsTable
