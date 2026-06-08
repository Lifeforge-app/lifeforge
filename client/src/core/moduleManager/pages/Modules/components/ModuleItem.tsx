import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { useAPIOnlineStatus } from '@lifeforge/shared'
import { useFederation } from '@lifeforge/federation'
import {
  Box,
  Card,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  Flex,
  Icon,
  TAILWIND_PALETTE,
  TagChip,
  Text,
  colorWithOpacity,
  useModalStore
} from '@lifeforge/ui'

import forgeAPI from '@/forgeAPI'

import type { InstalledModule } from '..'

function ModuleItem({
  module,
  onUninstall,
  onDevModeChange
}: {
  module: InstalledModule
  onUninstall: (moduleName: string) => Promise<void>
  onDevModeChange?: () => void
}) {
  const { environment } = useAPIOnlineStatus()

  // Module name format: @lifeforge/lifeforge--wallet -> lifeforge--wallet
  const moduleKey = module.name.replace('@lifeforge/', '')

  const { t } = useTranslation([`apps.${moduleKey}`, 'common.moduleManager'])

  const translatedTitle = t([`apps.${moduleKey}:title`, module.displayName])

  const translatedDescription = t([
    `apps.${moduleKey}:description`,
    module.description || ''
  ])

  const { open } = useModalStore()

  const { refetch: refetchFederation } = useFederation()

  const devModeMutation = useMutation({
    mutationFn: () =>
      forgeAPI.modules.devMode.toggle.mutate({ moduleName: module.name }),
    onSuccess: () => {
      toast.success(
        !module.isDevMode
          ? t('common.moduleManager:devMode.enabled', {
              module: translatedTitle
            })
          : t('common.moduleManager:devMode.disabled', {
              module: translatedTitle
            })
      )

      onDevModeChange?.()
      refetchFederation.current?.()
    },
    onError: () => {
      toast.error('Failed to toggle dev mode')
    }
  })

  function handleUninstall() {
    open(ConfirmationModal, {
      title: t('common.moduleManager:modals.uninstall.title', {
        module: translatedTitle
      }),
      description: t('common.moduleManager:modals.uninstall.description', {
        module: translatedTitle
      }),
      onConfirm: async () => {
        await onUninstall(module.name)
      }
    })
  }

  function handleDevModeToggle() {
    const isEnabling = !module.isDevMode

    open(ConfirmationModal, {
      title: isEnabling
        ? t('common.moduleManager:modals.devMode.enable.title')
        : t('common.moduleManager:modals.devMode.disable.title'),
      description: isEnabling
        ? t('common.moduleManager:modals.devMode.enable.description')
        : t('common.moduleManager:modals.devMode.disable.description'),
      onConfirm: async () => {
        await devModeMutation.mutateAsync()
      }
    })
  }

  return (
    <Card gap="md" minWidth="0">
      <Flex align="start" gap="md">
        <Flex
          centered
          shadow
          bg={colorWithOpacity('custom-500', '20%')}
          flexShrink="0"
          height="3em"
          r="lg"
          width="3em"
        >
          <Icon color="primary" icon={module.icon} size="1.5em" />
        </Flex>
        <Flex align="start" flex="1" gap="md" justify="between" minWidth="0">
          <Box minWidth="0">
            <Flex align="center" gap="sm">
              <Text truncate as="h3" size="lg" weight="semibold">
                {translatedTitle}
              </Text>
              {module.isDevMode && environment.client === 'development' && (
                <TagChip
                  color={TAILWIND_PALETTE.yellow[500]}
                  flexShrink="0"
                  icon="tabler:code"
                  label={t('common.moduleManager:devMode.label')}
                  size="sm"
                  variant="outlined"
                />
              )}
              {!module.hasDist && (
                <TagChip
                  color={TAILWIND_PALETTE.red[500]}
                  flexShrink="0"
                  icon="tabler:alert-triangle"
                  label={t('common.moduleManager:notBuilt.label')}
                  size="sm"
                  variant="outlined"
                />
              )}
            </Flex>
            <Text color="muted" size="sm">
              v{module.version}
            </Text>
          </Box>
          <ContextMenu>
            {environment.client === 'development' && (
              <ContextMenuItem
                disabled={!(module.hasSource && module.hasDist)}
                icon={module.isDevMode ? 'tabler:code-off' : 'tabler:code'}
                label={module.isDevMode ? 'devMode.disable' : 'devMode.enable'}
                namespace="common.moduleManager"
                onClick={handleDevModeToggle}
              />
            )}
            <ContextMenuItem
              dangerous
              icon="tabler:trash"
              label="uninstall"
              namespace="common.moduleManager"
              onClick={handleUninstall}
            />
          </ContextMenu>
        </Flex>
      </Flex>
      {translatedDescription && (
        <Text as="p" color="muted" leading="relaxed" lineClamp={2}>
          {translatedDescription}
        </Text>
      )}
      <Box style={{ marginTop: 'auto' }}>
        {module.author && (
          <Flex asChild align="center" gap="sm">
            <Text color="muted">
              <Icon icon="tabler:user" size="1.1rem" />
              <span>{module.author.split('<')[0].trim()}</span>
            </Text>
          </Flex>
        )}
      </Box>
    </Card>
  )
}

export default ModuleItem
