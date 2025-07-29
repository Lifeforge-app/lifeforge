import { useModalStore } from '@components/modals'
import { Icon } from '@iconify/react'
import { useCallback, useRef } from 'react'

import InputIcon from '../shared/components/InputIcon'
import InputLabel from '../shared/components/InputLabel'
import InputWrapper from '../shared/components/InputWrapper'
import useInputLabel from '../shared/hooks/useInputLabel'
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

  const inputLabel = useInputLabel(namespace, name)

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
        <InputLabel active={!!color} label={inputLabel} required={required} />
        <div className="mt-6 mr-4 flex w-full items-center gap-2 pl-4">
          <div
            className={`group-focus-within:border-bg-300 dark:group-focus-within:border-bg-700 mt-0.5 size-3 shrink-0 rounded-full border border-transparent`}
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
              setColor(e.target.value)
            }}
          />
        </div>
        <button
          className="text-bg-500 hover:bg-bg-200 hover:text-bg-800 dark:hover:bg-bg-700/70 dark:hover:text-bg-200 mr-4 shrink-0 rounded-lg p-2 transition-all focus:outline-hidden"
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
