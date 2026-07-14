import { useModuleTranslation } from '@lifeforge/localization'

import { ContextMenuGroup, ContextMenuItem } from '@/components/overlays'

export interface ViewModeContextMenuSelectorProps<
  T extends ReadonlyArray<{ value: string; icon?: string; text?: string }>,
  TKey = T[number]['value']
> {
  namespace: string | false | undefined
  currentMode: TKey
  onModeChange: (value: TKey) => void
  modes: T
}

export function ViewModeContextMenuSelector<
  T extends ReadonlyArray<{ value: string; icon?: string; text?: string }>,
  TKey = T[number]['value']
>({
  namespace,
  currentMode,
  onModeChange,
  modes
}: ViewModeContextMenuSelectorProps<T, TKey>) {
  const { t } = useModuleTranslation(['common.misc'])

  return (
    <ContextMenuGroup icon="tabler:eye" label={t('common.misc:viewMode')}>
      {modes.map(({ value, icon, text }) => (
        <ContextMenuItem
          key={value}
          checked={currentMode === value}
          icon={icon}
          label={
            namespace === false
              ? text || value
              : t([`viewModes.${text}`, `viewModes.${value}`], {
                  defaultValue: text || value
                })
          }
          namespace={false}
          onClick={() => {
            onModeChange(value as TKey)
          }}
        />
      ))}
    </ContextMenuGroup>
  )
}
