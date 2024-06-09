import { Listbox } from '@headlessui/react'
import React from 'react'

function ListboxInputWrapper({
  value,
  onChange,
  children
}: {
  value: string | null
  onChange: (value: any) => void
  children: React.ReactNode
}): React.ReactElement {
  return (
    <Listbox
      value={value}
      onChange={onChange}
      as="div"
      className="group relative mt-4 flex items-center gap-1 rounded-t-lg border-b-2 border-bg-500 bg-bg-200/50 shadow-custom focus-within:!border-custom-500 dark:bg-bg-800/50"
    >
      {children}
    </Listbox>
  )
}

export default ListboxInputWrapper
