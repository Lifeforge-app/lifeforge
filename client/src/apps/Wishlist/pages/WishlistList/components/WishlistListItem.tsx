import { Icon } from '@iconify/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  ConfirmationModal,
  HamburgerMenu,
  MenuItem,
  useModalStore
} from 'lifeforge-ui'
import { useCallback } from 'react'
import { Link } from 'react-router'
import { toast } from 'react-toastify'

import type { WishlistList } from '..'
import ModifyWishlistListModal from '../modals/ModifyWishlistModal'

function WishlistListItem({ list }: { list: WishlistList }) {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const deleteMutation = useMutation(
    forgeAPI.wishlist.lists.remove
      .input({
        id: list.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['wishlist'] })
        },
        onError: () => {
          toast.error('Failed to delete wishlist')
        }
      })
  )

  const handleUpdateList = useCallback(() => {
    open(ModifyWishlistListModal, {
      type: 'update',
      initialData: list
    })
  }, [list])

  const handleDeleteList = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Wishlist',
      description: 'Are you sure you want to delete this wishlist?',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      },
      buttonType: 'delete',
      confirmationPrompt: list.name
    })
  }, [list])

  return (
    <Link
      className="group component-bg-with-hover shadow-custom relative flex w-full flex-col gap-6 rounded-md p-4"
      to={`/wishlist/${list.id}`}
    >
      <div
        className="w-min rounded-md p-4"
        style={{
          backgroundColor: list.color + '20',
          color: list.color
        }}
      >
        <Icon className="size-8" icon={list.icon} />
      </div>
      <div className="w-full min-w-0 flex-1 space-y-2">
        <h2 className="truncate text-2xl font-semibold">{list.name}</h2>
        <p className="text-bg-500 min-w-0">{list.description}</p>
      </div>
      <div className="text-right">
        <div className="flex-between text-bg-500 text-sm whitespace-nowrap">
          <p>{list.bought_count} bought</p>
          <p>{list.total_count} items</p>
        </div>
        <progress
          className="progress bg-bg-200 dark:bg-bg-700 h-2 w-full rounded-lg"
          max="100"
          value={
            list.bought_count !== 0
              ? (list.bought_count / list.total_count) * 100
              : 0
          }
        ></progress>
        <div className="flex-between text-bg-500 text-sm">
          <p>
            Spent{' '}
            {new Intl.NumberFormat('en-MY', {
              style: 'currency',
              currency: 'MYR'
            }).format(list.bought_amount)}
          </p>
          <p>
            Total{' '}
            {new Intl.NumberFormat('en-MY', {
              style: 'currency',
              currency: 'MYR'
            }).format(list.total_amount)}
          </p>
        </div>
      </div>
      <HamburgerMenu
        classNames={{
          wrapper: 'absolute right-4 top-4'
        }}
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <MenuItem icon="tabler:pencil" text="Edit" onClick={handleUpdateList} />
        <MenuItem
          isRed
          icon="tabler:trash"
          text="Delete"
          onClick={handleDeleteList}
        />
      </HamburgerMenu>
    </Link>
  )
}

export default WishlistListItem
