import { Icon } from '@iconify/react'
import { useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

import { Button, HamburgerMenu, MenuItem } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import VW_CATEGORIES from '@apps/VirtualWardrobe/constants/virtual_wardrobe_categories'
import VW_COLORS from '@apps/VirtualWardrobe/constants/virtual_wardrobe_colors'
import { IVirtualWardrobeEntry } from '@apps/VirtualWardrobe/interfaces/virtual_wardrobe_interfaces'

import useComponentBg from '@hooks/useComponentBg'

import fetchAPI from '@utils/fetchAPI'

interface IEntryItemCommonProps<T extends boolean> {
  entry: IVirtualWardrobeEntry
  isCartItem?: T
}

interface IRegularItemProps {
  queryKey: unknown[]
  isInCart: boolean
  onRemoveFromCart?: never
}

interface ICartItemProps {
  queryKey?: never
  isInCart?: never
  onRemoveFromCart: () => Promise<void>
}

type IEntryItemProps<T extends boolean> = IEntryItemCommonProps<T> &
  (T extends true ? ICartItemProps : IRegularItemProps)

function EntryItem<T extends boolean = false>({
  entry,
  queryKey,
  isInCart,
  isCartItem = false as T,
  onRemoveFromCart
}: IEntryItemProps<T>) {
  const open = useModalStore(state => state.open)
  const queryClient = useQueryClient()
  const { componentBg, componentBgLighter } = useComponentBg()
  const [addToCartLoading, setAddToCartLoading] = useState(false)
  const [removeFromCartLoading, setRemoveFromCartLoading] = useState(false)

  async function handleAddToCart() {
    if (isInCart) {
      toast.info('Item already in cart')
      return
    }

    try {
      await fetchAPI(`virtual-wardrobe/session/${entry.id}`, {
        method: 'POST'
      })

      queryClient.setQueryData<IVirtualWardrobeEntry[]>(
        ['virtual-wardrobe', 'session-cart-items'],
        prev => {
          if (!prev) return prev
          return [...prev, entry]
        }
      )

      toast.success('Item added to cart')
    } catch {
      toast.error('Failed to add item to cart')
    }
  }

  const handleUpdateItem = useCallback(() => {
    open('virtualWardrobe.modifyEntry', {
      type: 'update',
      existedData: entry
    })
  }, [entry])

  const handleDeleteItem = useCallback(() => {
    open('deleteConfirmation', {
      apiEndpoint: 'virtual-wardrobe/entries',
      data: entry,
      itemName: 'item',
      nameKey: 'name',
      queryKey,
      updateDataList: () => {
        queryClient.setQueryData<IVirtualWardrobeEntry[]>(
          ['virtual-wardrobe', 'session-cart-items'],
          prev => {
            if (!prev) return prev
            return prev.filter(e => e.id !== entry.id)
          }
        )
        queryClient.invalidateQueries({
          queryKey: ['virtual-wardrobe', 'sidebar-data']
        })
      }
    })
  }, [entry])

  return (
    <li
      className={clsx(
        'group relative flex rounded-md p-4',
        isCartItem ? 'flex-row items-center gap-6' : 'flex-col',
        isCartItem ? componentBgLighter : componentBg
      )}
    >
      <img
        alt=""
        className={clsx(
          'aspect-square object-contain',
          isCartItem ? 'h-32' : 'h-64'
        )}
        src={`${import.meta.env.VITE_API_HOST}/media/${
          entry.front_image
        }?thumb=512x0`}
      />
      <div className="flex w-full flex-1 flex-col">
        <div
          className={clsx(
            'flex items-end justify-between gap-3',
            !isCartItem && 'mt-4'
          )}
        >
          <div className="space-y-1">
            <p className="flex items-center gap-1 text-sm text-zinc-500">
              <Icon
                className="size-4"
                icon={
                  VW_CATEGORIES.find(cat => cat.name === entry.category)
                    ?.icon ?? ''
                }
              />
              {entry.subcategory}
            </p>
            <p className="text-custom-500 text-xs font-semibold">
              {entry.brand === '' ? 'Unbranded' : entry.brand}
            </p>
            <p className="text-lg font-medium break-all">{entry.name}</p>
          </div>
          {!isCartItem && (
            <div className="shrink-0">
              <p className="mb-2 text-right text-sm whitespace-nowrap text-zinc-500">
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
                    className="border-bg-500 size-3 justify-self-end rounded-full border"
                    style={{
                      backgroundColor: VW_COLORS.find(c => c.name === color)
                        ?.hex
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div
          className={clsx(!isCartItem && 'flex flex-1 flex-col justify-end')}
        >
          <p className="mt-2 text-sm text-zinc-500">
            Worn {entry.times_worn} times
          </p>
          <p className="text-sm text-zinc-500">
            Last worn on:{' '}
            {entry.last_worn !== ''
              ? dayjs(entry.last_worn).fromNow()
              : 'Never'}
          </p>
        </div>
      </div>
      {!isCartItem ? (
        <>
          <Button
            className="mt-4"
            icon="tabler:plus"
            loading={addToCartLoading}
            variant="plain"
            onClick={() => {
              setAddToCartLoading(true)
              handleAddToCart()
                .catch(console.error)
                .finally(() => {
                  setAddToCartLoading(false)
                })
            }}
          >
            Add to Cart
          </Button>
          <HamburgerMenu
            classNames={{
              wrapper:
                'data-open:block absolute right-4 top-4 hidden group-hover:block'
            }}
          >
            <MenuItem
              icon="tabler:pencil"
              text="Edit"
              onClick={handleUpdateItem}
            />
            <MenuItem
              isRed
              icon="tabler:trash"
              text="Delete"
              onClick={handleDeleteItem}
            />
          </HamburgerMenu>
        </>
      ) : (
        <Button
          isRed
          className="mt-4"
          icon="tabler:trash"
          loading={removeFromCartLoading}
          variant="plain"
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
