import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React, { useState } from 'react'

import { Button } from '@lifeforge/ui'

import useThemeColors from '@hooks/useThemeColor'

function AddCardButton(): React.ReactElement {
  const [isFocused, setIsFocused] = useState(false)
  const { componentBgLighter } = useThemeColors()

  return (
    <li className="flex-center">
      {isFocused ? (
        <div className="mb-4 w-full space-y-2">
          <input
            className={clsx(
              'placeholder:text-bg-500 w-full rounded-md p-4',
              componentBgLighter
            )}
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
          className="border-bg-400 text-bg-500 hover:border-bg-800 hover:bg-bg-200 dark:border-bg-500 dark:hover:border-bg-100 dark:hover:bg-bg-800/20 dark:hover:text-bg-50 mb-4 flex w-full items-center gap-2 rounded-md border-[1.5px] border-dashed p-4 pl-3 font-medium transition-all"
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
