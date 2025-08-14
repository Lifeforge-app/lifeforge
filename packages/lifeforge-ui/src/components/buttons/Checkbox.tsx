import { Icon } from '@iconify/react'
import clsx from 'clsx'

function Checkbox({
  checked,
  onChange,
  className
}: {
  checked: boolean
  onChange: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
}) {
  return (
    <button
      className={clsx(
        'flex-center group relative z-50 size-7 shrink-0 cursor-pointer rounded-full border-2 transition-all',
        checked
          ? 'border-custom-500'
          : 'border-bg-300 hover:border-bg-500! dark:border-bg-700',
        className
      )}
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
        onChange(e)
      }}
    >
      <Icon
        className={clsx(
          'size-4 stroke-1',
          checked
            ? 'stroke-custom-500! text-custom-500!'
            : 'stroke-bg-800 text-bg-800 dark:stroke-bg-100 dark:text-bg-100 group-hover:text-bg-500! group-hover:stroke-bg-500! opacity-0 group-hover:opacity-100'
        )}
        icon="uil:check"
      />
    </button>
  )
}

export default Checkbox
