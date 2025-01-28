import { Combobox } from '@headlessui/react'
import React from 'react'

function ComboboxInputWrapper({
  value,
  onChange,
  setQuery,
  children
}: {
  value: string | string[] | undefined
  onChange: (value: any) => void
  setQuery: (query: string) => void
  children: React.ReactNode
}): React.ReactElement {
  return (
    <Combobox
      value={value}
      onChange={onChange}
      as="div"
      onClose={() => {
        setQuery('')
      }}
      className="relative mt-4 flex items-center gap-1 rounded-t-lg border-b-2 border-bg-500 bg-bg-200/50 pl-6 shadow-custom transition-all hover:bg-bg-200 data-open:border-custom-500! dark:bg-bg-800/50 dark:hover:bg-bg-800/80"
    >
      {children}
    </Combobox>
  )
}

export default ComboboxInputWrapper
