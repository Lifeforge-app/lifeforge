import clsx from 'clsx'

import Button from './Button'

function FAB({
  onClick,
  icon = 'tabler:plus',
  text = '',
  hideWhen = 'sm',
  alwaysShow = false,
  as,
  isRed,
  loading,
  className
}: {
  onClick?: () => void
  icon?: string
  hideWhen?: 'sm' | 'md' | 'lg' | 'xl'
  alwaysShow?: boolean
  text?: string
  as?: React.ElementType
  isRed?: boolean
  loading?: boolean
  className?: string
}) {
  return (
    <Button
      alwaysShow={alwaysShow}
      as={as ?? 'button'}
      className={clsx(
        'fixed right-6 bottom-6 z-[9992] shadow-lg',
        !alwaysShow &&
          {
            sm: 'sm:hidden',
            md: 'md:hidden',
            lg: 'lg:hidden',
            xl: 'xl:hidden'
          }[hideWhen],
        className
      )}
      icon={icon}
      isRed={isRed}
      loading={loading}
      onClick={onClick}
    >
      {text}
    </Button>
  )
}

export default FAB
