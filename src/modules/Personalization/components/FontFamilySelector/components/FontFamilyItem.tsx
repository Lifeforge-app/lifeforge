import { ListboxOption } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import { LazyLoadComponent } from 'react-lazy-load-image-component'

const LLC = LazyLoadComponent as any

function FontFamilyItem({ family }: { family: string }): React.ReactElement {
  return (
    <ListboxOption
      className="flex-between hover:bg-bg-100 dark:hover:bg-bg-800 relative flex h-16 cursor-pointer bg-transparent px-4 transition-all select-none"
      value={family}
    >
      {({ selected }) => (
        <LLC threshold={280}>
          <div className="flex items-center">
            <span
              className="flex items-center gap-2 text-base"
              style={{
                fontFamily: family
              }}
            >
              {family}
            </span>
          </div>
          {selected && (
            <Icon
              className="text-custom-500 block text-lg"
              icon="tabler:check"
            />
          )}
        </LLC>
      )}
    </ListboxOption>
  )
}

export default FontFamilyItem
