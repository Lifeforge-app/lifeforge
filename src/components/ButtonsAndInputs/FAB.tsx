import React from 'react'
import Button from './Button'

function FAB({
  onClick,
  icon = 'tabler:plus',
  text = '',
  hideWhen = 'sm',
  alwaysShow = false,
  as
}: {
  onClick?: () => void
  icon?: string
  hideWhen?: 'sm' | 'md' | 'lg' | 'xl'
  alwaysShow?: boolean
  text?: string
  as?: React.ElementType
}): React.ReactElement {
  return (
    <Button
      icon={icon}
      onClick={onClick}
      as={as ?? 'button'}
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
