import { useState } from 'react'

import { type InferOutput, useForgeMutation } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import { Box, Button, ModalHeader, Stack, Text, toast } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import TransactionCard from './components/TransactionCard'

export interface LocalTransaction {
  id: string
  date: string
  amount: number
  type: 'income' | 'expenses' | 'transfer'
  category?: string | null
  particulars?: string
  location_name?: string
  location_coords?: { lat: number; lon: number }
  asset?: string
  from?: string
  to?: string
  ledgers?: string[]
  receipt?: unknown
  collectionId?: string
}

function ConfirmMultipleTransactionsModal({
  onClose,
  data: { transactions: initialTransactions }
}: {
  onClose: () => void
  data: {
    transactions: InferOutput<typeof forgeAPI.transactions.fromNaturalLanguage>
  }
}) {
  const { t } = useModuleTranslation()

  const [transactions, setTransactions] = useState<LocalTransaction[]>(() =>
    initialTransactions.map((tx, idx) => ({
      id: `temp-${idx}-${Math.random().toString(36).substring(2, 11)}`,
      ...tx,
      ledgers: tx.ledgers ?? []
    }))
  )

  const mutation = useForgeMutation(forgeAPI.transactions.createMultiple, {
    action: 'create',
    queryKey: forgeAPI.key,
    onSuccess: () => {
      toast.success(t('toasts.createMultipleTransactions.success'))
      onClose()
    },
    onError: () => {
      toast.error(t('toasts.createMultipleTransactions.error'))
    }
  })

  const hasInvalid = transactions.some(
    tx =>
      !tx.date ||
      !tx.amount ||
      tx.amount <= 0 ||
      (tx.type === 'transfer'
        ? !tx.from || !tx.to
        : !tx.particulars || !tx.category || !tx.asset)
  )

  async function handleSaveAll() {
    if (hasInvalid) {
      toast.error(t('toasts.missingRequiredFields'))

      return
    }

    const mapped = transactions.map(tx => {
      if (tx.type === 'transfer') {
        return {
          type: 'transfer' as const,
          date: tx.date,
          amount: tx.amount,
          from: tx.from || '',
          to: tx.to || ''
        }
      } else {
        return {
          type: tx.type,
          date: tx.date,
          amount: tx.amount,
          particulars: tx.particulars || '',
          category: tx.category || '',
          asset: tx.asset || '',
          ledgers: tx.ledgers || [],
          location: tx.location_name
            ? {
                name: tx.location_name,
                formattedAddress: tx.location_name,
                location: {
                  latitude: tx.location_coords?.lat || 0,
                  longitude: tx.location_coords?.lon || 0
                }
              }
            : undefined
        }
      }
    })

    await mutation.mutateAsync({ transactions: mapped })
  }

  return (
    <Box minWidth="40vw">
      <ModalHeader
        icon="tabler:brain"
        title="naturalLanguage.confirmTitle"
        onClose={onClose}
      />
      <Stack gap="md">
        <Text color="muted">
          {t('modals.naturalLanguage.confirmDescription')}
        </Text>
        <Stack gap="sm">
          {transactions.map(tx => (
            <TransactionCard key={tx.id} tx={tx} onUpdate={setTransactions} />
          ))}
        </Stack>
        <Button
          disabled={hasInvalid || transactions.length === 0}
          icon="tabler:check"
          loading={mutation.isPending}
          mt="md"
          width="100%"
          onClick={handleSaveAll}
        >
          save
        </Button>
      </Stack>
    </Box>
  )
}

export default ConfirmMultipleTransactionsModal
