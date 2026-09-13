import { Flex, TagChip } from '@lifeforge/ui'

import { useWalletData } from '@/hooks/useWalletData'

import { useTransactionDetails } from '../TransactionDetailsContext'
import DetailItem from './DetailItem'

function LedgerSection() {
  const transaction = useTransactionDetails()
  const { ledgersQuery } = useWalletData()

  if (transaction.type === 'transfer') return null

  const ledger = ledgersQuery.data?.filter(l =>
    transaction.ledgers.includes(l.id)
  )

  if (!ledger || ledger.length === 0) return null

  return (
    <DetailItem icon="tabler:book" label="ledger">
      <Flex gap="sm" justify={{ sm: 'end' }} wrap="wrap">
        {ledger.map(ledgerItem => (
          <TagChip
            key={ledgerItem.id}
            color={ledgerItem.color}
            icon={ledgerItem.icon}
            label={ledgerItem.name}
          />
        ))}
      </Flex>
    </DetailItem>
  )
}

export default LedgerSection
