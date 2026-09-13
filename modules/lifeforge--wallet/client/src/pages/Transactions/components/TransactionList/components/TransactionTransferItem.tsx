import dayjs from 'dayjs'
import { useCallback } from 'react'

import {
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

function TransactionTransferItem({
  transaction
}: {
  transaction: WalletTransaction
}) {
  const { open } = useModalStore()
  const { assetsQuery } = useWalletData()

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

  if (transaction.type !== 'transfer') return null

  return (
    <Flex align="center" gap="xl" justify="between" minWidth="0" width="100%">
      <Flex
        align="center"
        gap={{ base: 'sm', sm: 'md' }}
        minWidth="0"
        width="100%"
      >
        <Icon color="muted" icon="tabler:transfer" size="2rem" />
        <Stack
          direction={{ base: 'column-reverse', sm: 'column' }}
          gap="none"
          minWidth="0"
          width="100%"
        >
          <Flex align="center" gap="sm" minWidth="0" width="100%">
            <Text truncate size="lg" weight="medium">
              Transfer from{' '}
              {assets.find(asset => asset.id === transaction.from)?.name ??
                'Unknown'}{' '}
              to{' '}
              {assets.find(asset => asset.id === transaction.to)?.name ??
                'Unknown'}
            </Text>
            {transaction.receipt && (
              <button onClick={handleViewReceipt}>
                <Icon color="muted" icon="tabler:file-text" size="1.25rem" />
              </button>
            )}
          </Flex>
          <Flex align="center" gap="sm">
            <Text
              color="muted"
              display={{ base: 'block', sm: 'none' }}
              size="sm"
              weight="medium"
            >
              {dayjs(transaction.date).format('DD MMM')}
            </Text>
            <Text
              color="muted"
              display={{ base: 'none', sm: 'block' }}
              size="sm"
              weight="medium"
            >
              {dayjs(transaction.date).format('MMM DD, YYYY')}
            </Text>
          </Flex>
        </Stack>
      </Flex>
      <Text color="blue-500" size="lg" weight="medium">
        {numberToCurrency(transaction.amount)}
      </Text>
    </Flex>
  )
}

export default TransactionTransferItem
