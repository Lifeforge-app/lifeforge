import { Switch as HeadlessSwitch } from '@headlessui/react'
import clsx from 'clsx'
import tinycolor from 'tinycolor2'

import useThemeColors from '@hooks/useThemeColor'

function Switch({
  checked,
  onChange
}: {
  checked: boolean
  onChange: () => void
}) {
  const { theme } = useThemeColors()

  const getStateClassName = () => {
    if (checked) {
      return clsx(
        tinycolor(theme).isLight() ? 'bg-bg-100 dark:bg-bg-800' : 'bg-bg-100',
        'translate-x-6'
      )
    }

    return 'translate-x-1 bg-bg-50 dark:bg-bg-500'
  }

  return (
    <HeadlessSwitch
      checked={checked}
      className={clsx(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full',
        checked ? 'bg-custom-500' : 'darker-component-bg-with-hover'
      )}
      onChange={onChange}
    >
      <span
        className={clsx(
          'inline-block size-4 shrink-0 rounded-full transition',
          getStateClassName()
        )}
      />
    </HeadlessSwitch>
  )
}

export default Switch
