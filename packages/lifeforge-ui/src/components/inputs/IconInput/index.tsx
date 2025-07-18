import { useModalStore } from '@components/modals'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import _ from 'lodash'
import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import InputIcon from '../shared/InputIcon'
import InputLabel from '../shared/InputLabel'
import InputWrapper from '../shared/InputWrapper'
import IconPickerModal from './IconPickerModal'

function IconInput({
  name,
  icon,
  disabled,
  setIcon,
  namespace,
  required
}: {
  name: string
  icon: string
  disabled?: boolean
  setIcon: (icon: string) => void
  namespace: string
  required?: boolean
}) {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation(namespace)

  const ref = useRef<HTMLInputElement | null>(null)

  function updateIcon(e: React.ChangeEvent<HTMLInputElement>): void {
    setIcon(e.target.value)
  }

  const handleIconSelectorOpen = useCallback(() => {
    open(IconPickerModal, {
      setSelectedIcon: setIcon
    })
  }, [])

  return (
    <InputWrapper darker disabled={disabled} inputRef={ref}>
      <InputIcon active={!!icon} icon="tabler:icons" />
      <div className="flex w-full items-center gap-2">
        <InputLabel
          active={!!icon}
          label={t([`inputs.${_.camelCase(name)}`, name])}
          required={required}
        />
        <div className="mt-6 mr-12 flex w-full items-center gap-2 pl-4">
          <div className="icon-input-icon size-4 shrink-0">
            <Icon
              className={clsx(
                'size-4 shrink-0',
                !icon &&
                  'pointer-events-none opacity-0 group-focus-within:opacity-100'
              )}
              icon={icon || 'tabler:question-mark'}
            />
          </div>
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
          onClick={handleIconSelectorOpen}
        >
          <Icon className="size-5" icon="tabler:chevron-down" />
        </button>
      </div>
    </InputWrapper>
  )
}

export default IconInput
