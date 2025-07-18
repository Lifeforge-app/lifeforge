import { Icon } from '@iconify/react'
import _ from 'lodash'
import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { useModalStore } from '@components/modals'

import InputIcon from '../shared/InputIcon'
import InputLabel from '../shared/InputLabel'
import InputWrapper from '../shared/InputWrapper'
import ColorPickerModal from './ColorPickerModal'

function ColorInput({
  name,
  color,
  setColor,
  className,
  namespace,
  required,
  disabled
}: {
  name: string
  color: string
  setColor: (value: string) => void
  className?: string
  namespace: string
  required?: boolean
  disabled?: boolean
}) {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation(namespace)

  const ref = useRef<HTMLInputElement | null>(null)

  const handleColorPickerOpen = useCallback(() => {
    open(ColorPickerModal, {
      color,
      setColor
    })
  }, [color])

  return (
    <InputWrapper
      darker
      className={className}
      disabled={disabled}
      inputRef={ref}
    >
      <InputIcon active={color !== ''} icon="tabler:palette" />
      <div className="flex w-full items-center gap-2">
        <InputLabel
          active={!!color}
          label={t([`inputs.${_.camelCase(name)}`, name])}
          required={required}
        />
        <div className="mr-4 mt-6 flex w-full items-center gap-2 pl-4">
          <div
            className={`mt-0.5 size-3 shrink-0 rounded-full border border-transparent group-focus-within:border-zinc-300 dark:group-focus-within:border-zinc-700`}
            style={{
              backgroundColor: color
            }}
          ></div>
          <input
            ref={ref}
            className="focus:outline-hidden focus:placeholder:text-bg-500 h-8 w-full min-w-28 rounded-lg bg-transparent p-6 pl-0 tracking-wide placeholder:text-transparent"
            placeholder="#FFFFFF"
            value={color}
            onChange={e => {
              setColor(e.target.value)
            }}
          />
        </div>
        <button
          className="text-bg-500 hover:bg-bg-200 hover:text-bg-800 focus:outline-hidden dark:hover:bg-bg-700/70 dark:hover:text-bg-200 mr-4 shrink-0 rounded-lg p-2 transition-all"
          type="button"
          onClick={handleColorPickerOpen}
        >
          <Icon className="size-6" icon="tabler:color-picker" />
        </button>
      </div>
    </InputWrapper>
  )
}

export default ColorInput
