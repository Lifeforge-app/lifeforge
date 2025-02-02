import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { Button } from '@components/buttons'
import useThemeColors from '@hooks/useThemeColor'

function AddCardButton(): React.ReactElement {
  const [isFocused, setIsFocused] = useState(false)
  const { componentBgLighter } = useThemeColors()

  return (
    <li className="flex-center">
      {isFocused ? (
        <div className="mb-4 w-full space-y-2">
          <input
            className={`${componentBgLighter} w-full rounded-md p-4 placeholder:text-bg-500`}
            placeholder="Enter a title or paste a link"
          />
          <Button
            className="w-full"
            icon="tabler:plus"
            onClick={() => {
              setIsFocused(false)
            }}
          >
            Add Entry Card
          </Button>
        </div>
      ) : (
        <button
          className="mb-4 flex w-full items-center gap-2 rounded-md border-[1.5px] border-dashed border-bg-400 p-4 pl-3 font-medium text-bg-500 transition-all hover:border-bg-800 hover:bg-bg-200 dark:border-bg-500 dark:hover:border-bg-100 dark:hover:bg-bg-800/20 dark:hover:text-bg-50"
          onClick={() => {
            setIsFocused(true)
          }}
        >
          <Icon className="text-xl" icon="tabler:plus" />
          <span>Add a card</span>
        </button>
      )}
    </li>
  )
}

export default AddCardButton
