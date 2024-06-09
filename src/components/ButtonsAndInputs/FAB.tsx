import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

function FAB({
  onClick: onclick,
  icon = 'tabler:plus',
  hideWhen = 'sm'
}: {
  onClick: () => void
  icon?: string
  hideWhen?: 'sm' | 'md' | 'lg' | 'xl'
}): React.ReactElement {
  return (
    <button
      onClick={onclick}
      className={`absolute bottom-6 right-6 z-10 flex items-center gap-2 rounded-lg bg-custom-500 p-4 font-semibold uppercase tracking-wider text-bg-100 shadow-lg hover:bg-custom-600 dark:text-bg-800 ${
        {
          sm: 'md:hidden',
          md: 'lg:hidden',
          lg: 'xl:hidden',
          xl: '2xl:hidden'
        }[hideWhen] ?? ''
      }
      `}
    >
      <Icon icon={icon} className="size-6 shrink-0 transition-all" />
    </button>
  )
}

export default FAB
