import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import React from 'react'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import VW_CATEGORIES from '@constants/virtual_wardrobe_categories'
import VW_COLORS from '@constants/virtual_wardrobe_colors'
import useThemeColors from '@hooks/useThemeColor'
import { type IVirtualWardrobeEntry } from '@interfaces/virtual_wardrobe_interfaces'

function EntryItem({
  entry,
  onUpdate,
  onDelete
}: {
  entry: IVirtualWardrobeEntry
  onUpdate: () => void
  onDelete: () => void
}): React.ReactElement {
  const { componentBgWithHover } = useThemeColors()

  return (
    <div
      className={`group relative flex flex-col rounded-md ${componentBgWithHover} p-4`}
    >
      <img
        src={`${import.meta.env.VITE_API_HOST}/media/${
          entry.front_image
        }?thumb=512x0`}
        className="aspect-square h-64 object-contain"
      />
      <div className="mt-4 flex items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="flex items-center gap-1 text-sm text-zinc-500">
            <Icon
              icon={
                VW_CATEGORIES.find(cat => cat.name === entry.category)?.icon ??
                ''
              }
              className="size-4"
            />
            {entry.subcategory}
          </p>
          {entry.brand !== '' && (
            <p className="text-xs font-semibold text-custom-500">
              {entry.brand}
            </p>
          )}
          <p className="text-lg font-medium">{entry.name}</p>
        </div>
        <div className="shrink-0">
          <p className="mb-2 whitespace-nowrap text-right text-sm text-zinc-500">
            Size: {entry.size}
          </p>
          <div className="mb-1.5 grid grid-cols-5 gap-1">
            {Array.from({ length: 5 - entry.colors.length }).map((_, index) => (
              <div key={`empty-${index}`} />
            ))}
            {entry.colors.map(color => (
              <span
                key={color}
                className="size-3 justify-self-end rounded-full border  border-bg-500"
                style={{
                  backgroundColor:
                    VW_COLORS.find(c => c.name === color)?.hex ?? ''
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-end">
        <p className="mt-2 text-sm text-zinc-500">
          Worn {entry.times_worn} times
        </p>
        <p className="text-sm text-zinc-500">
          Last worn on:{' '}
          {entry.last_worn !== '' ? moment(entry.last_worn).fromNow() : 'Never'}
        </p>
      </div>
      <HamburgerMenu className="absolute right-4 top-4 hidden group-hover:block data-[open]:block">
        <MenuItem
          icon="tabler:pencil"
          onClick={() => {
            onUpdate()
          }}
          text="Edit"
        />
        <MenuItem
          icon="tabler:trash"
          onClick={() => {
            onDelete()
          }}
          isRed
          text="Delete"
        />
      </HamburgerMenu>
    </div>
  )
}

export default EntryItem
