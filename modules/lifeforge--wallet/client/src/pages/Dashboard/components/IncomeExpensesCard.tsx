import { useQuery } from '@tanstack/react-query'

import { Flex, Icon, Text, Widget, WithQuery } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import { useWalletStore } from '@/stores/useWalletStore'

import numberToCurrency from '../../../utils/numberToCurrency'

function IncomeExpenseCard({ title, icon }: { title: string; icon: string }) {
  const isIncome = title.toLowerCase() === 'income'

  const { isAmountHidden } = useWalletStore()

  const incomeExpensesQuery = useQuery(
    forgeAPI.analytics.getIncomeExpensesSummary
      .input({
        year: new Date().getFullYear().toString(),
        month: (new Date().getMonth() + 1).toString()
      })
      .queryOptions()
  )

  return (
    <Widget
      gridColumnSpan={1}
      gridRowSpan={1}
      icon={icon}
      title={isIncome ? 'income' : 'expenses'}
    >
      <WithQuery query={incomeExpensesQuery}>
        {data => (
          <Flex direction="column" height="100%" justify="evenly">
            <Flex align="end" gap="sm" height="auto" width="100%">
              <Flex asChild align="baseline" gap="sm" height="auto">
                <Text size={{ base: '4xl', xl: '5xl' }} weight="medium">
                  <Text color="muted" size={{ base: '2xl', xl: '3xl' }}>
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
                            size={{ base: '1.5rem', xl: '2rem' }}
                          />
                        ))}
                    </Flex>
                  ) : (
                    numberToCurrency(
                      +data[`total${title}` as 'totalIncome' | 'totalExpenses']
                    )
                  )}
                </Text>
              </Flex>
            </Flex>
            <Flex align="baseline" gap="sm" mt="md">
              <Flex asChild align={isAmountHidden ? 'center' : 'baseline'}>
                <Text
                  color={isIncome ? 'green-500' : 'red-500'}
                  whiteSpace="nowrap"
                >
                  {isIncome ? '+' : '-'} RM
                  {isAmountHidden ? (
                    <Flex align="center" display="inline-flex" ml="sm">
                      {Array(4)
                        .fill(0)
                        .map((_, i) => (
                          <Icon key={i} icon="uil:asterisk" size="1rem" />
                        ))}
                    </Flex>
                  ) : (
                    numberToCurrency(
                      +data[
                        `monthly${title}` as 'monthlyIncome' | 'monthlyExpenses'
                      ]
                    )
                  )}
                </Text>
              </Flex>
              <Text>from this month</Text>
            </Flex>
          </Flex>
        )}
      </WithQuery>
    </Widget>
  )
}

export default IncomeExpenseCard
