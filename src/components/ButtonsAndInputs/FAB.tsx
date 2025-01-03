import React from 'react'
import Button from './Button'

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
    <Button
      icon={icon}
      onClick={onclick}
      className={`fixed bottom-6 right-6 z-10 shadow-lg ${
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
      {text}
    </Button>
  )
}

export default FAB
