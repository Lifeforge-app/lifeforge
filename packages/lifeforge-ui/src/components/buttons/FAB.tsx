import clsx from 'clsx'

import Button from './Button'

function FAB({
  icon = 'tabler:plus',
  visibilityBreakpoint = 'md',
  ...props
}: {
  /** The icon identifier string. Defaults to 'tabler:plus'. */
  icon?: string
  /** The responsive breakpoint at which the FAB should be hidden. Defaults to 'sm'. */
  visibilityBreakpoint?: 'sm' | 'md' | 'lg' | 'xl'
} & React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      className={clsx(
        'fixed right-6 bottom-6 z-[9992] shadow-lg',
        visibilityBreakpoint &&
          {
            sm: 'sm:hidden',
            md: 'md:hidden',
            lg: 'lg:hidden',
            xl: 'xl:hidden'
          }[visibilityBreakpoint],
        props.className
      )}
      icon={icon}
    />
  )
}

export default FAB
