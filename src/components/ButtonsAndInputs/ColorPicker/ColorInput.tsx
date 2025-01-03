import { Icon } from '@iconify/react'
import React, { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'
import InputIcon from '../Input/components/InputIcon'
import InputWrapper from '../Input/components/InputWrapper'

function ColorInput({
  name,
  color,
  updateColor,
  setColorPickerOpen,
  hasTopMargin = true,
  className
}: {
  name: string
  color: string
  updateColor: (value: string) => void
  setColorPickerOpen: React.Dispatch<React.SetStateAction<boolean>>
  hasTopMargin?: boolean
  className?: string
}): React.ReactElement {
  const { t } = useTranslation()
  const ref = useRef<HTMLInputElement | null>(null)

  const handleColorPickerOpen = useCallback(() => {
    setColorPickerOpen(true)
  }, [setColorPickerOpen])

  return (
    <InputWrapper
      inputRef={ref}
      darker
      className={`${hasTopMargin ? 'mt-4' : ''} ${className}`}
    >
      <InputIcon icon="tabler:palette" active={color !== ''} />
      <div className="flex w-full items-center gap-2">
        <span
          className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-bg-500 group-focus-within:!text-custom-500 ${
            color.length === 0
              ? 'top-1/2 -translate-y-1/2 group-focus-within:top-6 group-focus-within:text-[14px]'
              : 'top-6 -translate-y-1/2 text-[14px]'
          }`}
        >
          {t(`input.${toCamelCase(name)}`)}
        </span>
        <div className="mr-4 mt-6 flex w-full items-center gap-2 pl-4">
          <div
            className="mt-0.5 size-3 shrink-0 rounded-full"
            style={{
              backgroundColor: color
            }}
          ></div>
          <input
            ref={ref}
            value={color}
            onChange={e => {
              updateColor(e.target.value)
            }}
            placeholder="#FFFFFF"
            className="h-8 w-full min-w-28 rounded-lg bg-transparent p-6 pl-0 tracking-wide placeholder:text-transparent focus:outline-none focus:placeholder:text-bg-500"
          />
        </div>
        <button
          onClick={() => {
            handleColorPickerOpen()
          }}
          className="mr-4 shrink-0 rounded-lg p-2 text-bg-500 transition-all hover:bg-bg-200 hover:text-bg-800 focus:outline-none dark:hover:bg-bg-700/70 dark:hover:text-bg-200"
        >
          <Icon icon="tabler:color-picker" className="size-6" />
        </button>
      </div>
    </InputWrapper>
  )
}

export default ColorInput
