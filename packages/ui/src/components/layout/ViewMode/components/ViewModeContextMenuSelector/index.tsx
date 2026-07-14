import { useTranslation } from 'react-i18next'

import { ContextMenuGroup, ContextMenuItem } from '@/components/overlays'

export interface ViewModeContextMenuSelectorProps<
  T extends ReadonlyArray<{ value: string; icon?: string; text?: string }>,
  TKey = T[number]['value']
> {
  currentMode: TKey
  onModeChange: (value: TKey) => void
  modes: T
}

export function ViewModeContextMenuSelector<
  T extends ReadonlyArray<{ value: string; icon?: string; text?: string }>,
  TKey = T[number]['value']
>({
  currentMode,
  onModeChange,
  modes
}: ViewModeContextMenuSelectorProps<T, TKey>) {
  const { t } = useTranslation('common.misc')

  return (
    <ContextMenuGroup icon="tabler:eye" label={t('common.misc:viewMode')}>
      {modes.map(({ value, icon, text }) => (
        <ContextMenuItem
          key={value}
          checked={currentMode === value}
          icon={icon}
          label={text || icon || 'Unnamed View Mode'}
          onClick={() => {
            onModeChange(value as TKey)
          }}
        />
      ))}
    </ContextMenuGroup>
  )
}
