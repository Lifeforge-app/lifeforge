import { Listbox } from '@headlessui/react'
import React from 'react'

function ListboxInputWrapper({
  value,
  onChange,
  multiple = false,
  children
}: {
  value: string | string[] | null
  onChange: (value: any) => void
  multiple?: boolean
  children: React.ReactNode
}): React.ReactElement {
  return (
    <Listbox
      value={value}
      onChange={onChange}
      as="div"
      multiple={multiple}
      className="relative mt-4 flex items-center gap-1 rounded-t-lg border-b-2 border-bg-500 bg-bg-200/50 shadow-custom transition-all hover:bg-bg-200 data-[open]:!border-custom-500 dark:bg-bg-800/50 dark:hover:bg-bg-800/70"
    >
      {children}
    </Listbox>
  )
}

export default ListboxInputWrapper
