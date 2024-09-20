import { Icon } from '@iconify/react'
import React from 'react'

function FAB({
  onClick: onclick,
  icon = 'tabler:plus',
  text = '',
  hideWhen = 'sm',
  alwaysShow = false
}: {
  onClick: () => void
  icon?: string
  hideWhen?: 'sm' | 'md' | 'lg' | 'xl'
  alwaysShow?: boolean
  text?: string
}): React.ReactElement {
  return (
    <button
      onClick={onclick}
      className={`fixed bottom-6 right-6 z-10 flex items-center gap-2 rounded-lg bg-custom-500 p-4 font-medium tracking-wide text-bg-50 shadow-lg hover:bg-custom-600 dark:text-bg-800 ${
        alwaysShow
          ? ''
          : {
              sm: 'sm:hidden',
              md: 'md:hidden',
              lg: 'lg:hidden',
              xl: 'xl:hidden'
            }[hideWhen] ?? ''
      }
      `}
    >
      <Icon icon={icon} className="size-6 shrink-0 transition-all" />
      {text}
    </button>
  )
}

export default FAB
