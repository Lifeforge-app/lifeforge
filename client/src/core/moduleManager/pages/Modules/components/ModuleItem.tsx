import { Icon } from '@iconify/react'
import { useMutation } from '@tanstack/react-query'
import {
  Card,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  TagChip,
  useModalStore
} from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import COLORS from 'tailwindcss/colors'

import { useFederation } from '@/federation'
import forgeAPI from '@/forgeAPI'

interface ModuleData {
  name: string
  displayName: string
  version: string
  description: string
  author: string
  icon: string
  category: string
  isDevMode?: boolean
}

function ModuleItem({
  module,
  onUninstall,
  onDevModeChange
}: {
  module: ModuleData
  onUninstall: (moduleName: string) => Promise<void>
  onDevModeChange?: () => void
}) {
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
    onSuccess: data => {
      if (data.success) {
        toast.success(
          data.isDevMode
            ? t('common.moduleManager:devMode.enabled', {
                module: translatedTitle
              })
            : t('common.moduleManager:devMode.disabled', {
                module: translatedTitle
              })
        )
        onDevModeChange?.()
        refetchFederation()
      }
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
    <Card className="group flex min-w-0 flex-col gap-4">
      <div className="flex min-w-0 items-start gap-4">
        <div className="bg-custom-500/20 text-custom-500 flex size-12 shrink-0 items-center justify-center rounded-lg shadow-sm">
          <Icon className="size-7" icon={module.icon} />
        </div>
        <div className="flex min-w-0 flex-1 items-start justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="w-full min-w-0 truncate text-lg font-semibold">
                {translatedTitle}
              </h3>
              {module.isDevMode && (
                <TagChip
                  className="text-xs!"
                  color={COLORS.yellow[500]}
                  icon="tabler:code"
                  label={t('common.moduleManager:devMode.label')}
                  variant="outlined"
                />
              )}
            </div>
            <div className="text-bg-500 flex items-center text-sm">
              v{module.version}
            </div>
          </div>
          <ContextMenu>
            {import.meta.env.DEV && (
              <ContextMenuItem
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
        </div>
      </div>
      {translatedDescription && (
        <p className="text-bg-500 line-clamp-2 leading-relaxed">
          {translatedDescription}
        </p>
      )}
      <div className="mt-auto">
        {module.author && (
          <div className="text-bg-500 flex items-center gap-1.5 text-sm">
            <Icon className="size-4" icon="tabler:user" />
            <span>{module.author.split('<')[0].trim()}</span>
          </div>
        )}
      </div>
    </Card>
  )
}

export default ModuleItem
