/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Icon } from '@iconify/react'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'
import InputWrapper from '../Input/components/InputWrapper'

function IconInput({
  name,
  icon,
  setIcon,
  setIconSelectorOpen
}: {
  name: string
  icon: string
  setIcon: (icon: string) => void
  setIconSelectorOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  const { t } = useTranslation()
  const ref = useRef<HTMLInputElement | null>(null)

  function updateIcon(e: React.ChangeEvent<HTMLInputElement>): void {
    setIcon(e.target.value)
  }

  return (
    <>
      <InputWrapper inputRef={ref} darker className="mt-4">
        <Icon
          icon="tabler:icons"
          className={`ml-6 size-6 shrink-0 ${
            icon ? '' : 'text-bg-500'
          } group-focus-within:!text-custom-500`}
        />
        <div className="flex w-full items-center gap-2">
          <span
            className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-bg-500 transition-all group-focus-within:!text-custom-500 ${
              icon.length === 0
                ? 'top-1/2 -translate-y-1/2 group-focus-within:top-6 group-focus-within:text-[14px]'
                : 'top-6 -translate-y-1/2 text-[14px]'
            }`}
          >
            {t(`input.${toCamelCase(name)}`)}
          </span>
          <div className="mr-12 mt-6 flex w-full items-center gap-2 pl-4">
            <Icon
              className={`size-4 shrink-0 ${
                !icon &&
                'pointer-events-none opacity-0 group-focus-within:opacity-100'
              }`}
              icon={icon || 'tabler:question-mark'}
            />
            <input
              ref={ref}
              value={icon}
              onChange={updateIcon}
              placeholder="tabler:cube"
              className="h-8 w-full rounded-lg bg-transparent p-6 pl-0 tracking-wide placeholder:text-transparent focus:outline-none focus:placeholder:text-bg-500"
            />
          </div>
          <button
            onClick={() => {
              setIconSelectorOpen(true)
            }}
            className="mr-4 shrink-0 rounded-lg p-2 text-bg-500 transition-all hover:bg-bg-300 hover:text-bg-800 focus:outline-none dark:hover:bg-bg-700/70 dark:hover:text-bg-200"
          >
            <Icon icon="tabler:chevron-down" className="size-5" />
          </button>
        </div>
      </InputWrapper>
    </>
  )
}

export default IconInput