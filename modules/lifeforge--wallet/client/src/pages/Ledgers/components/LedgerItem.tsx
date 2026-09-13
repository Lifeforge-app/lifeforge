import { useNavigate } from 'react-router'

import { useForgeMutation } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  Box,
  Card,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  Flex,
  Icon,
  Stack,
  Text,
  useModalStore
} from '@lifeforge/ui'

import type { WalletLedger } from '@/hooks/useWalletData'
import { forgeAPI } from '@/manifest'

import ModifyLedgerModal from '../modals/ModifyLedgerModal'

function LedgerItem({ ledger }: { ledger: WalletLedger }) {
  const { t } = useModuleTranslation()
  const navigate = useNavigate()
  const { open } = useModalStore()

  const deleteMutation = useForgeMutation(
    forgeAPI.ledgers.remove.input({ id: ledger.id }),
    { action: 'delete', queryKey: forgeAPI.ledgers.key }
  )

  const handleEditLedger = () =>
    open(ModifyLedgerModal, { type: 'update', initialData: ledger })

  const handleDeleteLedger = () =>
    open(ConfirmationModal, {
      title: 'Delete Ledger',
      description: `Are you sure you want to delete the ledger "${ledger.name}"? This action cannot be undone.`,
      confirmationButton: 'delete',
      confirmationPrompt: ledger.name,
      onConfirm: async () => {
        await deleteMutation.mutateAsync(undefined)
      }
    })

  return (
    <Card
      isInteractive
      align="center"
      direction="row"
      gap="md"
      justify="between"
      onClick={() => navigate(`/wallet/transactions?ledger=${ledger.id}`)}
    >
      <Flex align="center" gap="md">
        <Box p="sm" r="md" style={{ backgroundColor: ledger.color + '20' }}>
          <Icon
            icon={ledger.icon}
            size="2rem"
            style={{ color: ledger.color }}
          />
        </Box>
        <Stack gap="none">
          <Text as="h2" size="xl" weight="medium">
            {ledger.name}
          </Text>
          <Text color="muted" size="sm">
            {ledger.amount} {t('transactionCount')}
          </Text>
        </Stack>
      </Flex>
      <ContextMenu>
        <ContextMenuItem
          icon="tabler:pencil"
          label="Edit"
          onClick={handleEditLedger}
        />
        <ContextMenuItem
          dangerous
          icon="tabler:trash"
          label="Delete"
          onClick={handleDeleteLedger}
        />
      </ContextMenu>
    </Card>
  )
}

export default LedgerItem
