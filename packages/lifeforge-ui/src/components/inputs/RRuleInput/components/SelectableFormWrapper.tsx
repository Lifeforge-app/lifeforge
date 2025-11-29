import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'
import { useTranslation } from 'react-i18next'

function SelectableFormWrapper({
  selected,
  formId,
  onSelect,
  children
}: {
  selected: boolean
  formId: string
  onSelect: () => void
  children: React.ReactNode
}) {
  const { t } = useTranslation(['apps.calendar', 'common.misc'])

  return (
    <div
      className={clsx(
        'relative rounded-md border-2 p-4 transition-all',
        selected ? 'border-custom-500' : 'border-bg-400 dark:border-bg-700'
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className={clsx(
            'flex-center size-5 rounded-full border-2 transition-all',
            selected ? 'border-custom-500' : 'border-bg-400 dark:border-bg-700'
          )}
        >
          {selected && (
            <Icon
              className="text-custom-500 stroke-0.5 stroke-custom-500"
              icon="uil:check"
            />
          )}
        </div>
        <p className={clsx('transition-all', selected ? '' : 'text-bg-500')}>
          {t(`inputs.${formId}.title`)}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">{children}</div>
      <button
        className={clsx(
          'bg-bg-100/50 dark:bg-bg-950/30 absolute inset-0 flex h-full transition-[opacity] duration-200',
          selected ? 'z-[-1] opacity-0' : 'z-0 opacity-100'
        )}
        onClick={onSelect}
      />
    </div>
  )
}

export default SelectableFormWrapper
