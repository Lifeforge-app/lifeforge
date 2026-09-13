import dayjs from 'dayjs'

import {
  Box,
  Button,
  Card,
  ConfirmationModal,
  Flex,
  Stack,
  Text,
  Tooltip,
  surface,
  useModalStore
} from '@lifeforge/ui'

import type { WalletTransaction } from '../../..'
import TransactionIncomeExpensesItem from '../../../components/TransactionList/components/TransactionIncomeExpensesItem'
import TransactionTransferItem from '../../../components/TransactionList/components/TransactionTransferItem'
import ModifyTransactionsModal from '../../ModifyTransactionsModal'
import type { LocalTransaction } from '../index'

function TransactionCard({
  tx,
  onUpdate
}: {
  tx: LocalTransaction
  onUpdate: (updater: (prev: LocalTransaction[]) => LocalTransaction[]) => void
}) {
  const { open } = useModalStore()

  function isTransactionValid(t: LocalTransaction) {
    if (!t.date || !t.amount || t.amount <= 0) return false
    if (t.type === 'transfer') return !!t.from && !!t.to

    return !!t.particulars && !!t.category && !!t.asset
  }

  function handleEdit() {
    open(ModifyTransactionsModal, {
      type: 'create',
      initialData: tx as unknown as {
        type: WalletTransaction['type']
      } & Partial<WalletTransaction>,
      onSubmit: data => {
        onUpdate(prev =>
          prev.map(t => {
            if (t.id !== tx.id) return t

            return {
              ...t,
              type: data.type,
              date: dayjs(data.date).format('YYYY-MM-DD'),
              amount: data.amount,
              from: data.type === 'transfer' ? data.from : undefined,
              to: data.type === 'transfer' ? data.to : undefined,
              particulars:
                data.type !== 'transfer' ? data.particulars || '' : '',
              category: data.type !== 'transfer' ? data.category || null : null,
              asset: data.type !== 'transfer' ? data.asset : undefined,
              ledgers: data.type !== 'transfer' ? (data.ledgers ?? []) : [],
              location_name:
                data.type !== 'transfer' ? data.location?.name : undefined,
              location_coords:
                data.type !== 'transfer' && data.location
                  ? {
                      lat: data.location.location.latitude,
                      lon: data.location.location.longitude
                    }
                  : undefined,
              receipt: data.receipt
            }
          })
        )
      }
    })
  }

  function handleDelete() {
    open(ConfirmationModal, {
      icon: 'tabler:trash',
      title: 'Delete Transaction',
      description: 'Are you sure you want to delete this transaction?',
      confirmButton: {
        text: 'Delete',
        icon: 'tabler:trash',
        isDangerous: true
      },
      onConfirm: async () => {
        onUpdate(prev => prev.filter(t => t.id !== tx.id))
      }
    })
  }

  const isValid = isTransactionValid(tx)

  return (
    <Card
      align="center"
      bg={surface.light}
      direction="row"
      gap="md"
      justify="between"
      p="md"
      style={{
        border: isValid ? undefined : '1px solid #f59e0b'
      }}
    >
      {tx.type === 'transfer' ? (
        <TransactionTransferItem
          transaction={tx as unknown as WalletTransaction}
        />
      ) : (
        <TransactionIncomeExpensesItem
          transaction={tx as unknown as WalletTransaction}
        />
      )}
      {!isValid && (
        <Tooltip
          icon="tabler:alert-triangle"
          iconProps={{ color: 'yellow-500' }}
          id={`missing-details-${tx.id}`}
        >
          <Text as="div" size="base">
            <Stack gap="xs" minWidth="200px">
              <Text weight="medium">Missing required fields</Text>
              <Box
                as="ul"
                pl="md"
                style={{
                  listStyleType: 'disc'
                }}
              >
                {tx.type !== 'transfer' ? (
                  <>
                    {!tx.particulars && <li>Particulars</li>}
                    {!tx.category && <li>Category</li>}
                    {!tx.asset && <li>Asset</li>}
                  </>
                ) : (
                  <>
                    {!tx.from && <li>From asset</li>}
                    {!tx.to && <li>To asset</li>}
                  </>
                )}
              </Box>
            </Stack>
          </Text>
        </Tooltip>
      )}
      <Flex align="center" gap="xs">
        <Button icon="tabler:pencil" variant="plain" onClick={handleEdit} />
        <Button
          dangerous
          icon="tabler:trash"
          variant="plain"
          onClick={handleDelete}
        />
      </Flex>
    </Card>
  )
}

export default TransactionCard
