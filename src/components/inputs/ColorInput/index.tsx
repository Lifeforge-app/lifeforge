import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React, { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'
import InputIcon from '../shared/InputIcon'
import InputWrapper from '../shared/InputWrapper'

function ColorInput({
  name,
  color,
  setColor: updateColor,
  setColorPickerOpen,
  hasTopMargin = true,
  className,
  namespace
}: {
  name: string
  color: string
  setColor: (value: string) => void
  setColorPickerOpen: React.Dispatch<React.SetStateAction<boolean>>
  hasTopMargin?: boolean
  className?: string
  namespace: string
}): React.ReactElement {
  const { t } = useTranslation(namespace)
  const ref = useRef<HTMLInputElement | null>(null)

  const handleColorPickerOpen = useCallback(() => {
    setColorPickerOpen(true)
  }, [setColorPickerOpen])

  return (
    <InputWrapper
      darker
      className={clsx(hasTopMargin && 'mt-4', className)}
      inputRef={ref}
    >
      <InputIcon active={color !== ''} icon="tabler:palette" />
      <div className="flex w-full items-center gap-2">
        <span
          className={clsx(
            'text-bg-500 group-focus-within:!text-custom-500 pointer-events-none absolute left-[4.2rem] font-medium tracking-wide',
            color.length === 0
              ? 'top-1/2 -translate-y-1/2 group-focus-within:top-6 group-focus-within:text-[14px]'
              : 'top-6 -translate-y-1/2 text-[14px]'
          )}
        >
          {t(`inputs.${toCamelCase(name)}`)}
        </span>
        <div className="mt-6 mr-4 flex w-full items-center gap-2 pl-4">
          <div
            className="mt-0.5 size-3 shrink-0 rounded-full"
            style={{
              backgroundColor: color
            }}
          ></div>
          <input
            ref={ref}
            className="focus:placeholder:text-bg-500 h-8 w-full min-w-28 rounded-lg bg-transparent p-6 pl-0 tracking-wide placeholder:text-transparent focus:outline-hidden"
            placeholder="#FFFFFF"
            value={color}
            onChange={e => {
              updateColor(e.target.value)
            }}
          />
        </div>
        <button
          className="text-bg-500 hover:bg-bg-200 hover:text-bg-800 dark:hover:bg-bg-700/70 dark:hover:text-bg-200 mr-4 shrink-0 rounded-lg p-2 transition-all focus:outline-hidden"
          onClick={() => {
            handleColorPickerOpen()
          }}
        >
          <Icon className="size-6" icon="tabler:color-picker" />
        </button>
      </div>
    </InputWrapper>
  )
}

export default ColorInput
