import React from 'react'

function Chip({
  text,
  selected,
  onClick
}: {
  text: string
  selected: boolean
  onClick: () => void
}): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${
        selected
          ? '!bg-custom-500 font-semibold text-bg-100 shadow-sm dark:text-bg-800'
          : 'bg-white hover:bg-bg-50 dark:bg-bg-800 dark:hover:bg-bg-700/70'
      } flex-center flex h-8 grow whitespace-nowrap rounded-full px-6 text-sm shadow-sm transition-all duration-100 md:grow-0`}
    >
      {text}
    </button>
  )
}

export default Chip
