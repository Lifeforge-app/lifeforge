import { ListboxOption } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import { LazyLoadComponent } from 'react-lazy-load-image-component'

const LLC = LazyLoadComponent as any

function FontFamilyItem({ family }: { family: string }): React.ReactElement {
  return (
    <ListboxOption
      className="flex-between relative flex h-16 cursor-pointer select-none bg-transparent px-4 transition-all hover:bg-bg-100 hover:dark:bg-bg-800"
      value={family}
    >
      {({ selected }) => (
        <LLC threshold={280}>
          <div className="flex items-center">
            <span
              style={{
                fontFamily: family
              }}
              className="flex items-center gap-2 text-base"
            >
              {family}
            </span>
          </div>
          {selected && (
            <Icon
              icon="tabler:check"
              className="block text-lg text-custom-500"
            />
          )}
        </LLC>
      )}
    </ListboxOption>
  )
}

export default FontFamilyItem
