import React from 'react'

function EntryName({ name }: { name: string }): React.ReactElement {
  return (
    <div className="pointer-events-none z-50 w-[20rem] truncate text-lg font-medium ">
      {name}
    </div>
  )
}

export default EntryName
