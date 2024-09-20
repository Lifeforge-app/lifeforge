import { ListboxOption } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { LazyLoadComponent } from 'react-lazy-load-image-component'

function FontFamilyItem({ family }: { family: string }): React.ReactElement {
  return (
    <ListboxOption
      className="flex-between relative flex cursor-pointer select-none bg-transparent p-4 transition-all hover:bg-bg-100 hover:dark:bg-bg-800"
      value={family}
    >
      {({ selected }) => (
        // @ts-expect-error No fix for that
        <LazyLoadComponent threshold={280}>
          <div className="flex h-8 items-center">
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
        </LazyLoadComponent>
      )}
    </ListboxOption>
  )
}

export default FontFamilyItem
