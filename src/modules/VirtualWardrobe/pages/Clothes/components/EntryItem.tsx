import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import React, { useState } from 'react'
import { Button } from '@components/buttons'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import VW_CATEGORIES from '@constants/virtual_wardrobe_categories'
import VW_COLORS from '@constants/virtual_wardrobe_colors'
import useThemeColors from '@hooks/useThemeColor'
import { type IVirtualWardrobeEntry } from '@interfaces/virtual_wardrobe_interfaces'

interface IEntryItemCommonProps<T extends boolean> {
  entry: IVirtualWardrobeEntry
  isCartItem?: T
}

interface IRegularItemProps {
  onUpdate: () => void
  onDelete: () => void
  onAddToCart: () => Promise<void>
  onRemoveFromCart?: never
}

interface ICartItemProps {
  onUpdate?: never
  onDelete?: never
  onAddToCart?: never
  onRemoveFromCart: () => Promise<void>
}

type IEntryItemProps<T extends boolean> = IEntryItemCommonProps<T> &
  (T extends true ? ICartItemProps : IRegularItemProps)

function EntryItem<T extends boolean = false>({
  entry,
  isCartItem = false as T,
  onUpdate,
  onDelete,
  onAddToCart,
  onRemoveFromCart
}: IEntryItemProps<T>): React.ReactElement {
  const { componentBg, componentBgLighter } = useThemeColors()
  const [addToCartLoading, setAddToCartLoading] = useState(false)
  const [removeFromCartLoading, setRemoveFromCartLoading] = useState(false)

  return (
    <li
      className={`group relative flex ${
        isCartItem ? 'flex-row items-center gap-6' : 'flex-col'
      } rounded-md ${isCartItem ? componentBgLighter : componentBg} p-4`}
    >
      <img
        alt=""
        src={`${import.meta.env.VITE_API_HOST}/media/${
          entry.front_image
        }?thumb=512x0`}
        className={`aspect-square h-64 object-contain ${
          isCartItem ? 'h-32' : 'h-64'
        }`}
      />
      <div className="flex w-full flex-1 flex-col">
        <div
          className={`${
            !isCartItem && 'mt-4'
          } flex items-end justify-between gap-4`}
        >
          <div className="space-y-1">
            <p className="flex items-center gap-1 text-sm text-zinc-500">
              <Icon
                icon={
                  VW_CATEGORIES.find(cat => cat.name === entry.category)
                    ?.icon ?? ''
                }
                className="size-4"
              />
              {entry.subcategory}
            </p>
            <p className="text-xs font-semibold text-custom-500">
              {entry.brand === '' ? 'Unbranded' : entry.brand}
            </p>
            <p className="text-lg font-medium">{entry.name}</p>
          </div>
          {!isCartItem && (
            <div className="shrink-0">
              <p className="mb-2 whitespace-nowrap text-right text-sm text-zinc-500">
                Size: {entry.size}
              </p>
              <div className="mb-1.5 grid grid-cols-5 gap-1">
                {Array.from({ length: 5 - entry.colors.length }).map(
                  (_, index) => (
                    <div key={`empty-${index}`} />
                  )
                )}
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
          )}
        </div>
        <div className={!isCartItem ? 'flex flex-1 flex-col justify-end' : ''}>
          <p className="mt-2 text-sm text-zinc-500">
            Worn {entry.times_worn} times
          </p>
          <p className="text-sm text-zinc-500">
            Last worn on:{' '}
            {entry.last_worn !== ''
              ? moment(entry.last_worn).fromNow()
              : 'Never'}
          </p>
        </div>
      </div>
      {!isCartItem ? (
        <>
          <Button
            loading={addToCartLoading}
            variant="no-bg"
            icon="tabler:plus"
            className="mt-4"
            onClick={() => {
              setAddToCartLoading(true)
              onAddToCart!()
                .catch(console.error)
                .finally(() => {
                  setAddToCartLoading(false)
                })
            }}
          >
            Add to Cart
          </Button>
          <HamburgerMenu className="absolute right-4 top-4 hidden group-hover:block data-[open]:block">
            <MenuItem icon="tabler:pencil" onClick={onUpdate!} text="Edit" />
            <MenuItem
              icon="tabler:trash"
              onClick={onDelete!}
              isRed
              text="Delete"
            />
          </HamburgerMenu>
        </>
      ) : (
        <Button
          variant="no-bg"
          isRed
          icon="tabler:trash"
          className="mt-4"
          loading={removeFromCartLoading}
          onClick={() => {
            setRemoveFromCartLoading(true)
            onRemoveFromCart!()
              .catch(console.error)
              .finally(() => {
                setRemoveFromCartLoading(false)
              })
          }}
        ></Button>
      )}
    </li>
  )
}

export default EntryItem
