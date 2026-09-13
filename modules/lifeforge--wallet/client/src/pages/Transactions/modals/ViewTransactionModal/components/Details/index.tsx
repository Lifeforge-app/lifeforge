import { Stack } from '@lifeforge/ui'

import type { WalletTransaction } from '@/pages/Transactions'

import { TransactionDetailsProvider } from './TransactionDetailsContext'
import AssetSection from './components/AssetSection'
import CategorySection from './components/CategorySection'
import DateSection from './components/DateSection'
import LedgerSection from './components/LedgerSection'
import LocationSection from './components/LocationSection'
import ReceiptSection from './components/ReceiptSection'
import TransactionTypeSection from './components/TransactionTypeSection'

function Details({ transaction }: { transaction: WalletTransaction }) {
  return (
    <TransactionDetailsProvider transaction={transaction}>
      <Stack gap="md" mt="lg">
        <TransactionTypeSection />
        <DateSection />
        <CategorySection />
        <AssetSection />
        <LedgerSection />
        <ReceiptSection />
        <LocationSection />
      </Stack>
    </TransactionDetailsProvider>
  )
}

export default Details
