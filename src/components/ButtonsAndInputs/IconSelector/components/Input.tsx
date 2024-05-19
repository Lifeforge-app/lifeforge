/* eslint-disable object-curly-newline */
/* eslint-disable react/prop-types */
import { Icon } from '@iconify/react'
import React from 'react'

function Input({
  value,
  setValue,
  placeholder,
  icon
}: {
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
  placeholder: string
  icon: string
}): React.ReactElement {
  return (
    <div className="flex w-full items-center gap-3 rounded-md bg-bg-800 px-5 shadow-md">
      <Icon icon={icon} className="h-5 w-5 text-bg-200" />
      <input
        type="text"
        className="w-full bg-transparent py-4 text-bg-200 outline-none placeholder:text-bg-100"
        placeholder={placeholder}
        value={value}
        onChange={e => {
          setValue(e.target.value)
        }}
      />
    </div>
  )
}

export default Input
