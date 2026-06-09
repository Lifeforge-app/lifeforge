import { useMutation, useQueryClient } from '@tanstack/react-query'
import copy from 'copy-to-clipboard'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from '@lifeforge/ui'

import { useFederation } from '@lifeforge/federation'
import {
  Box,
  Button,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  Flex,
  Icon,
  OptionsColumn,
  TAILWIND_PALETTE,
  TagChip,
  Text,
  useModalStore
} from '@lifeforge/ui'

import forgeAPI from '@/forgeAPI'

import type { APIKeyEntry } from '..'
import ModifyAPIKeyModal from '../modals/ModifyAPIKeyModal'
import ModulesRequiredListModal from '../modals/ModulesRequiredListModal'

dayjs.extend(relativeTime)

function EntryItem({ entry }: { entry: APIKeyEntry }) {
  const { t } = useTranslation('common.api-keys')

  const { modules } = useFederation()

  const queryClient = useQueryClient()

  const { open } = useModalStore()

  const [isCopying, setIsCopying] = useState(false)

  const deleteMutation = useMutation(
    forgeAPI.apiKeys.entries.remove
      .input({
        id: entry.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['apiKeys']
          })
          toast.success('API Key deleted successfully')
        },
        onError: () => {
          toast.error('Failed to delete API Key')
        }
      })
  )

  const modulesRequiredCount = modules
    .flatMap(cat => cat.items)
    .filter(item => item.APIKeyAccess?.[entry.keyId]).length

  async function copyKey() {
    setIsCopying(true)

    try {
      const key = await forgeAPI.apiKeys.entries.get
        .input({
          keyId: entry.keyId
        })
        .query()

      if (!key) {
        throw new Error()
      }

      copy(key)
      toast.success('Key copied to clipboard')
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch key')
    } finally {
      setIsCopying(false)
    }
  }

  const handleUpdateEntry = useCallback(async () => {
    try {
      open(ModifyAPIKeyModal, {
        type: 'update',
        initialData: {
          ...entry
        }
      })
    } catch {
      toast.error('Failed to fetch API Key')
    }
  }, [entry])

  const handleDeleteEntry = () =>
    open(ConfirmationModal, {
      title: 'Delete API Key',
      description: `Are you sure you want to delete the API Key "${entry.name}"? This action cannot be undone.`,
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(undefined)
      }
    })

  return (
    <OptionsColumn
      key={entry.id}
      description={
        modulesRequiredCount > 0 && (
          <Box mt="sm">
            <Flex align="center" gap="sm">
              <Text color="muted">
                {t('misc.requiredBy', { count: modulesRequiredCount })}
              </Text>
              <Button
                icon="tabler:info-circle"
                p="xs"
                variant="plain"
                onClick={() =>
                  open(ModulesRequiredListModal, {
                    keyId: entry.keyId
                  })
                }
              />
            </Flex>
          </Box>
        )
      }
      icon={entry.icon}
      title={
        <>
          <Text>
            {entry.name}
            <Box asChild ml="sm">
              <Text as="code" color="muted" size="sm">
                ({entry.keyId})
              </Text>
            </Box>
          </Text>
          <TagChip
            color={
              entry.exposable
                ? TAILWIND_PALETTE.green['500']
                : TAILWIND_PALETTE.red['500']
            }
            icon={entry.exposable ? 'tabler:world' : 'tabler:lock'}
            label={
              entry.exposable ? t('misc.exposable') : t('misc.internalOnly')
            }
            ml="sm"
            size="sm"
          />
        </>
      }
    >
      <Box mr="sm">
        <Flex align="center" gap="sm" justify={{ base: 'start', md: 'end' }}>
          {Array(12)
            .fill(0)
            .map((_, i) => (
              <Icon key={i} icon="tabler:circle-filled" size="4px" />
            ))}
          <Text size="lg">{entry.key}</Text>
        </Flex>
        <Text as="code" color="muted">
          {t('misc.lastUpdated', { time: dayjs(entry.updated).fromNow() })}
        </Text>
      </Box>
      <Flex gap="sm">
        {entry.exposable && (
          <Button
            icon="tabler:copy"
            loading={isCopying}
            variant="plain"
            onClick={() => {
              copyKey().catch(console.error)
            }}
          />
        )}
        <ContextMenu>
          <ContextMenuItem
            icon="tabler:pencil"
            label="edit"
            onClick={handleUpdateEntry}
          />
          <ContextMenuItem
            dangerous
            icon="tabler:trash"
            label="delete"
            onClick={handleDeleteEntry}
          />
        </ContextMenu>
      </Flex>
    </OptionsColumn>
  )
}

export default EntryItem
