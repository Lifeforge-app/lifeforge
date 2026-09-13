import dayjs from 'dayjs'
import { useCallback } from 'react'

import {
  Box,
  Flex,
  Icon,
  Stack,
  Text,
  ViewImageModal,
  useModalStore
} from '@lifeforge/ui'

import { useWalletData } from '@/hooks/useWalletData'
import { forgeAPI } from '@/manifest'
import numberToCurrency from '@/utils/numberToCurrency'

import type { WalletTransaction } from '../../..'

function TransactionIncomeExpensesItem({
  transaction
}: {
  transaction: WalletTransaction
}) {
  const { open } = useModalStore()
  const { categoriesQuery, ledgersQuery, assetsQuery } = useWalletData()

  const categories = categoriesQuery.data ?? []

  const ledgers = ledgersQuery.data ?? []

  const assets = assetsQuery.data ?? []

  const handleViewReceipt = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()

      if (!transaction.receipt) return

      open(ViewImageModal, {
        src: forgeAPI.getMedia({
          collectionId: transaction.collectionId,
          recordId: transaction.id,
          fieldId: transaction.receipt
        })
      })
    },
    [transaction]
  )

  if (transaction.type === 'transfer') return null

  return (
    <Flex align="center" gap="xl" justify="between" minWidth="0" width="100%">
      <Flex
        align="center"
        flex="1"
        gap={{ base: 'sm', sm: 'md' }}
        minWidth="0"
        width="100%"
      >
        <Box
          height="3rem"
          r="full"
          style={{
            backgroundColor:
              categories.find(category => category.id === transaction.category)
                ?.color ?? 'transparent'
          }}
          width="0.25rem"
        />
        <Icon
          color={{ base: 'muted', print: 'zinc-500' }}
          icon={
            assets.find(asset => asset.id === transaction.asset)?.icon ?? ''
          }
          size="2rem"
        />
        <Stack
          direction={{ base: 'column-reverse', sm: 'column' }}
          gap="xs"
          minWidth="0"
        >
          <Flex align="center" gap="sm" minWidth="0">
            <Text truncate size="lg" weight="medium">
              {transaction.particulars}{' '}
              {transaction.location_name && (
                <>
                  <Text color="muted">@</Text> {transaction.location_name}
                </>
              )}
            </Text>
            {transaction.receipt && (
              <button onClick={handleViewReceipt}>
                <Icon
                  color={{ base: 'muted', print: 'zinc-500' }}
                  icon="tabler:file-text"
                  size="1.25rem"
                />
              </button>
            )}
          </Flex>
          <Text asChild color="muted">
            <Flex align="center" gap="sm">
              <Text
                display={{ base: 'block', sm: 'none' }}
                size="sm"
                weight="medium"
              >
                {dayjs(transaction.date).format('DD MMM')}
              </Text>
              <Text
                display={{ base: 'none', sm: 'block' }}
                size="sm"
                weight="medium"
              >
                {dayjs(transaction.date).format('MMM DD, YYYY')}
              </Text>
              {transaction.ledgers.length > 0 && (
                <>
                  <Icon icon="tabler:circle-filled" size="0.25rem" />
                  <Text size="sm" weight="medium">
                    In
                  </Text>
                  <Flex align="center" gap="xs">
                    <Icon
                      icon={
                        ledgers.find(
                          ledger => ledger.id === transaction.ledgers[0]
                        )?.icon ?? ''
                      }
                      size="1rem"
                      style={{
                        color:
                          ledgers.find(
                            ledger => ledger.id === transaction.ledgers[0]
                          )?.color ?? 'white'
                      }}
                    />
                    <Text
                      color="muted"
                      display={{ base: 'none', md: 'block' }}
                      size="sm"
                      weight="medium"
                    >
                      {ledgers.find(
                        ledger => ledger.id === transaction.ledgers[0]
                      )?.name ?? 'Unknown'}
                    </Text>
                  </Flex>
                  {transaction.ledgers.length > 1 && (
                    <Text truncate size="sm" weight="medium">
                      + {transaction.ledgers.length - 1} more
                    </Text>
                  )}
                </>
              )}
            </Flex>
          </Text>
        </Stack>
      </Flex>
      <Text
        color={transaction.type === 'income' ? 'green-500' : 'red-500'}
        size="lg"
        weight="medium"
      >
        {transaction.type === 'income' ? '+' : '-'}
        {numberToCurrency(transaction.amount)}
      </Text>
    </Flex>
  )
}

export default TransactionIncomeExpensesItem
