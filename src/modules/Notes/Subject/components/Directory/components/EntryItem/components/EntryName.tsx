import React from 'react'

function EntryName({ name }: { name: string }): React.ReactElement {
  return (
    <div className="pointer-events-none z-50 w-[20rem] truncate text-lg font-medium text-bg-900 dark:text-bg-100">
      {name}
    </div>
  )
}

export default EntryName
