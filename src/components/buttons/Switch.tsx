import { Switch as HeadlessSwitch } from '@headlessui/react'
import clsx from 'clsx'
import React from 'react'
import useThemeColors from '@hooks/useThemeColor'
import { isLightColor } from '@utils/colors'

function Switch({
  checked,
  onChange
}: {
  checked: boolean
  onChange: () => void
}): React.ReactElement {
  const { darkerComponentBgWithHover, theme } = useThemeColors()

  const getStateClassName = () => {
    if (checked) {
      return clsx(
        isLightColor(theme) ? 'bg-bg-100 dark:bg-bg-800' : 'bg-bg-100',
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
        checked ? 'bg-custom-500' : darkerComponentBgWithHover
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
