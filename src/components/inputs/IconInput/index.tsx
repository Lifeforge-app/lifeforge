import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'
import InputIcon from '../shared/InputIcon'
import InputWrapper from '../shared/InputWrapper'

function IconInput({
  name,
  icon,
  setIcon,
  setIconSelectorOpen,
  namespace
}: {
  name: string
  icon: string
  setIcon: (icon: string) => void
  setIconSelectorOpen: React.Dispatch<React.SetStateAction<boolean>>
  namespace: string
}): React.ReactElement {
  const { t } = useTranslation(namespace)
  const ref = useRef<HTMLInputElement | null>(null)

  function updateIcon(e: React.ChangeEvent<HTMLInputElement>): void {
    setIcon(e.target.value)
  }

  return (
    <>
      <InputWrapper darker className="mt-4" inputRef={ref}>
        <InputIcon active={!!icon} icon="tabler:icons" />
        <div className="flex w-full items-center gap-2">
          <span
            className={clsx(
              'text-bg-500 group-focus-within:!text-custom-500 pointer-events-none absolute left-[4.2rem] font-medium tracking-wide transition-all',
              icon.length === 0
                ? 'top-1/2 -translate-y-1/2 group-focus-within:top-6 group-focus-within:text-[14px]'
                : 'top-6 -translate-y-1/2 text-[14px]'
            )}
          >
            {t(`inputs.${toCamelCase(name)}`)}
          </span>
          <div className="mt-6 mr-12 flex w-full items-center gap-2 pl-4">
            <Icon
              className={clsx(
                'size-4 shrink-0',
                !icon &&
                  'pointer-events-none opacity-0 group-focus-within:opacity-100'
              )}
              icon={icon || 'tabler:question-mark'}
            />
            <input
              ref={ref}
              className="focus:placeholder:text-bg-500 h-8 w-full rounded-lg bg-transparent p-6 pl-0 tracking-wide placeholder:text-transparent focus:outline-hidden"
              placeholder="tabler:cube"
              value={icon}
              onChange={updateIcon}
            />
          </div>
          <button
            className="text-bg-500 hover:bg-bg-300 hover:text-bg-800 dark:hover:bg-bg-700/70 dark:hover:text-bg-200 mr-4 shrink-0 rounded-lg p-2 transition-all focus:outline-hidden"
            onClick={() => {
              setIconSelectorOpen(true)
            }}
          >
            <Icon className="size-5" icon="tabler:chevron-down" />
          </button>
        </div>
      </InputWrapper>
    </>
  )
}

export default IconInput
