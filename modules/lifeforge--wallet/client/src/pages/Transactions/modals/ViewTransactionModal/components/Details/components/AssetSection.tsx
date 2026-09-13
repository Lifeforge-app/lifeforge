import { Box, Flex, Icon, Text } from '@lifeforge/ui'

import { useWalletData } from '@/hooks/useWalletData'

import { useTransactionDetails } from '../TransactionDetailsContext'
import DetailItem from './DetailItem'

function AssetSection() {
  const transaction = useTransactionDetails()
  const { assetsQuery } = useWalletData()

  if (transaction.type === 'transfer') {
    const fromAsset = assetsQuery.data?.find(a => a.id === transaction.from)

    const toAsset = assetsQuery.data?.find(a => a.id === transaction.to)

    return (
      <DetailItem icon="tabler:exchange" label="asset">
        <Flex align="center" gap="xs" minWidth="0">
          <Flex align="center" gap="xs">
            <Icon icon={fromAsset!.icon} size="1.5rem" />
            <Box asChild maxWidth="24rem">
              <Text truncate>{fromAsset!.name}</Text>
            </Box>
          </Flex>
          <Icon color="muted" icon="tabler:arrow-right" size="1.5rem" />
          <Flex align="center" gap="xs">
            <Icon icon={toAsset!.icon} size="1.5rem" />
            <Box asChild maxWidth="24rem">
              <Text truncate>{toAsset!.name}</Text>
            </Box>
          </Flex>
        </Flex>
      </DetailItem>
    )
  }

  const asset = assetsQuery.data?.find(a => a.id === transaction.asset)

  return (
    <DetailItem icon="tabler:wallet" label="asset">
      <Flex align="center" gap="xs">
        <Icon icon={asset!.icon} size="1.5rem" />
        <Box asChild maxWidth="24rem">
          <Text truncate>{asset!.name}</Text>
        </Box>
      </Flex>
    </DetailItem>
  )
}

export default AssetSection
