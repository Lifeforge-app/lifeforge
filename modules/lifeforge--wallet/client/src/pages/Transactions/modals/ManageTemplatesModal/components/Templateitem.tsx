import { useQuery } from '@tanstack/react-query'

import { useForgeMutation } from '@lifeforge/api'
import {
  Box,
  Card,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  Flex,
  Icon,
  Text,
  surface,
  useModalStore
} from '@lifeforge/ui'

import type { WalletTemplate } from '@/hooks/useWalletData'
import { forgeAPI } from '@/manifest'

import ModifyTemplatesModal from '../../ModifyTemplatesModal'
import ModifyTransactionsModal from '../../ModifyTransactionsModal'

function TemplateItem({
  template,
  choosing,
  onClose
}: {
  template: WalletTemplate
  choosing: boolean
  onClose: () => void
}) {
  const { open } = useModalStore()
  const categoriesQuery = useQuery(forgeAPI.categories.list.queryOptions())

  const deleteMutation = useForgeMutation(
    forgeAPI.templates.remove.input({ id: template.id }),
    { action: 'delete', queryKey: forgeAPI.templates.key }
  )

  return (
    <Card
      align="center"
      bg={choosing ? surface.lightInteractive : surface.light}
      direction="row"
      gap="md"
      justify="between"
      onClick={
        choosing
          ? () => {
              onClose()
              open(ModifyTransactionsModal, {
                type: 'create',
                initialData: template
              })
            }
          : undefined
      }
    >
      <Flex align="center" gap="md" minWidth="0" width="100%">
        {(() => {
          const targetCategory = (categoriesQuery.data ?? []).find(
            cat => cat.id === template.category
          )

          return (
            <Box
              p="sm"
              r="md"
              style={{
                backgroundColor: targetCategory
                  ? targetCategory.color + '10'
                  : undefined
              }}
            >
              <Icon
                icon={targetCategory?.icon || 'tabler:template'}
                size="1.5rem"
                style={{ color: targetCategory?.color }}
              />
            </Box>
          )
        })()}
        <Text truncate size="lg" weight="medium">
          {template.name}
        </Text>
      </Flex>
      {!choosing && (
        <ContextMenu>
          <ContextMenuItem
            icon="tabler:pencil"
            label="Edit"
            onClick={() =>
              open(ModifyTemplatesModal, {
                type: 'update',
                initialData: template
              })
            }
          />
          <ContextMenuItem
            dangerous
            icon="tabler:trash"
            label="Delete"
            onClick={() => {
              open(ConfirmationModal, {
                title: 'Delete Template',
                description: 'Are you sure you want to delete this template?',
                confirmationButton: 'delete',
                onConfirm: async () => {
                  await deleteMutation.mutateAsync(undefined)
                }
              })
            }}
          />
        </ContextMenu>
      )}
    </Card>
  )
}

export default TemplateItem
