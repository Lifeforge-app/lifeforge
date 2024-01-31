/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState } from 'react'
import IconSelector from '.'

function IconInput({
  name,
  icon,
  setIcon
}: {
  name: string
  icon: string
  setIcon: React.Dispatch<React.SetStateAction<string>>
}): React.ReactElement {
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false)

  function updateIcon(e: React.ChangeEvent<HTMLInputElement>): void {
    setIcon(e.target.value)
  }

  return (
    <>
      <div className="group relative mt-6 flex items-center gap-1 rounded-t-lg border-b-2 border-neutral-500 bg-neutral-200/50 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] focus-within:border-custom-500 dark:bg-neutral-800/50">
        <Icon
          icon="tabler:icons"
          className={`ml-6 h-6 w-6 shrink-0 ${
            icon ? 'text-neutral-100' : 'text-neutral-500'
          } group-focus-within:text-custom-500`}
        />

        <div className="flex w-full items-center gap-2">
          <span
            className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-neutral-500 group-focus-within:text-custom-500 ${
              icon.length === 0
                ? 'top-1/2 -translate-y-1/2 group-focus-within:top-6 group-focus-within:text-[14px]'
                : 'top-6 -translate-y-1/2 text-[14px]'
            }`}
          >
            {name}
          </span>
          <div className="mr-12 mt-6 flex w-full items-center gap-2 pl-4">
            <Icon
              className={`h-4 w-4 shrink-0 rounded-full ${
                !icon && 'hidden group-focus-within:block'
              }`}
              icon={icon || 'tabler:question-mark'}
            />
            <input
              value={icon}
              onChange={updateIcon}
              placeholder="tabler:cube"
              className="h-8 w-full rounded-lg bg-transparent p-6 pl-0 tracking-wide placeholder:text-transparent focus:outline-none focus:placeholder:text-neutral-400"
            />
          </div>
          <button
            onClick={() => {
              setIconSelectorOpen(true)
            }}
            className="mr-4 shrink-0 rounded-lg p-2 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 focus:outline-none dark:hover:bg-neutral-500/30 dark:hover:text-neutral-200"
          >
            <Icon icon="tabler:chevron-down" className="h-6 w-6" />
          </button>
        </div>
      </div>
      <IconSelector
        isOpen={iconSelectorOpen}
        setOpen={setIconSelectorOpen}
        setSelectedIcon={setIcon}
      />
    </>
  )
}

export default IconInput
