export const generateBaseClass = (
  hasChildren: boolean,
  iconAtEnd: boolean
): string =>
  `flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg p-4 ${
    hasChildren && (iconAtEnd ? 'pl-5' : 'pr-5')
  } font-medium tracking-wide transition-all disabled:cursor-not-allowed`

export const generateColorClass = (isRed: boolean, variant: string): string => {
  if (isRed) {
    return variant !== 'no-bg'
      ? 'bg-red-500 hover:bg-red-600 text-bg-50 dark:text-bg-800'
      : 'text-red-500 hover:text-red-600 hover:bg-red-500/10'
  }

  switch (variant) {
    case 'primary':
      return 'bg-custom-500 shadow-custom hover:bg-custom-600 text-bg-50 dark:text-bg-800 disabled:bg-bg-500 disabled:hover:bg-bg-500'
    case 'no-bg':
      return 'hover:bg-bg-200/50 dark:hover:bg-bg-800/50 text-bg-500 hover:text-bg-800 dark:hover:text-bg-50 disabled:text-bg-400'
    case 'secondary':
    default:
      return 'bg-bg-300 shadow-custom text-bg-500 dark:text-bg-800 dark:bg-bg-600 hover:bg-bg-400/50 dark:hover:bg-bg-500/80'
  }
}

export const generateClassName = (
  hasChildren: boolean,
  iconAtEnd: boolean,
  isRed: boolean,
  variant: string,
  className: string
): string =>
  `${generateBaseClass(hasChildren, iconAtEnd)} ${generateColorClass(
    isRed,
    variant
  )} ${className}`
