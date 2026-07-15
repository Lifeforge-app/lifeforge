import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import type { InferOutput } from '@lifeforge/api'
import {
  Button,
  Card,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  Flex,
  Icon,
  Stack,
  Switch,
  Text,
  colorWithOpacity,
  surface,
  useModalStore,
  usePersonalization
} from '@lifeforge/ui'

import forgeAPI from '@/core/utils/forgeAPI'

import ModifyOAuthProviderModal from '../../ModifyOAuthProviderModal'

function ProviderItem({
  entry
}: {
  entry: InferOutput<typeof forgeAPI.auth.oauth.providers.listOptions>[number]
}) {
  const { language } = usePersonalization()
  const { t } = useTranslation('common.account-settings')
  const { open } = useModalStore()
  const queryClient = useQueryClient()

  const toggleMutation = useMutation(
    forgeAPI.auth.oauth.providers.toggle
      .input({ id: entry.id || '' })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: forgeAPI.auth.oauth.providers.key
          })
        }
      })
  )

  const deleteMutation = useMutation(
    forgeAPI.auth.oauth.providers.remove
      .input({ id: entry.id || '' })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: forgeAPI.auth.oauth.providers.key
          })
        }
      })
  )

  const handleDelete = () =>
    open(ConfirmationModal, {
      title: `Delete ${entry.name}?`,
      description:
        'Are you sure you want to delete this OAuth provider? This action is irreversible!',
      onConfirm: () => deleteMutation.mutateAsync(undefined)
    })

  return (
    <Card
      key={entry.provider}
      align="center"
      bg={surface.light}
      direction="row"
      gap="2xl"
      justify="between"
    >
      <Flex align="center" gap="md">
        <Flex
          centered
          bg={colorWithOpacity('bg-500', '10%')}
          flexShrink="0"
          height="3em"
          r="md"
          width="3em"
        >
          <Icon color="muted" icon={entry.icon} size="1.5em" />
        </Flex>
        <Stack>
          <Text size="lg" weight="medium">
            {entry.name}
          </Text>
          {entry.updated && (
            <Text color="muted" size="sm">
              {entry.updated && t('misc.lastUpdated')}
              {dayjs(entry.updated)
                .locale(language)
                .format('MMM DD, YYYY, HH:mm:ss')}
            </Text>
          )}
        </Stack>
      </Flex>
      {entry.configured && entry.id ? (
        <Flex align="center" gap="md">
          <Switch
            value={entry.enabled}
            onChange={() => toggleMutation.mutate(undefined)}
          />
          <ContextMenu>
            <ContextMenuItem
              icon="tabler:pencil"
              label="Update"
              onClick={() =>
                open(ModifyOAuthProviderModal, {
                  provider: entry.provider,
                  type: 'update'
                })
              }
            />
            <ContextMenuItem
              dangerous
              icon="tabler:trash"
              label="Delete"
              onClick={handleDelete}
            />
          </ContextMenu>
        </Flex>
      ) : (
        <Button
          icon="tabler:plus"
          variant="plain"
          onClick={() =>
            open(ModifyOAuthProviderModal, {
              provider: entry.provider,
              type: 'create'
            })
          }
        />
      )}
    </Card>
  )
}

export default ProviderItem
