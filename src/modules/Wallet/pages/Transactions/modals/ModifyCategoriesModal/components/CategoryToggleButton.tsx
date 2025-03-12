import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

function CategoryToggleButton({
  categoryType,
  setCategoryType,
  iconName,
  label,
  activeBgColor
}: {
  categoryType: 'income' | 'expenses'
  setCategoryType: (type: 'income' | 'expenses') => void
  iconName: string
  label: string
  activeBgColor: string
}) {
  const { t } = useTranslation('modules.wallet')

  return (
    <button
      className={clsx(
        'shadow-custom flex w-1/2 items-center justify-center gap-2 rounded-md p-4 font-medium transition-all',
        categoryType === label.toLowerCase()
          ? `${activeBgColor} text-bg-800`
          : 'bg-bg-200 text-bg-500 dark:bg-bg-800/50'
      )}
      onClick={() => {
        setCategoryType(label.toLowerCase() as 'income' | 'expenses')
      }}
    >
      <Icon className="size-6" icon={iconName} />
      {t(`transactionTypes.${label.toLowerCase()}`)}
    </button>
  )
}

export default CategoryToggleButton
