import { Icon } from '@iconify/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  ItemWrapper,
  useModalStore
} from 'lifeforge-ui'
import { useCallback } from 'react'
import { Link } from 'react-router'
import { toast } from 'react-toastify'

import type { IdeaBoxContainer } from '@apps/01.Productivity/IdeaBox/providers/IdeaBoxProvider'

import ModifyContainerModal from '../../ModifyContainerModal'

function ContainerItem({ container }: { container: IdeaBoxContainer }) {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const deleteMutation = useMutation(
    forgeAPI.ideaBox.containers.remove
      .input({
        id: container.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['ideaBox', 'containers']
          })
        },
        onError: () => {
          toast.error('Failed to delete container')
        }
      })
  )

  const handleUpdateContainer = useCallback(() => {
    open(ModifyContainerModal, {
      type: 'update',
      initialData: container
    })
  }, [container])

  const handleDeleteContainer = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Container',
      description: 'Are you sure you want to delete this container?',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      },
      confirmationButton: 'delete',
      confirmationPrompt: container.name
    })
  }, [container])

  return (
    <ItemWrapper
      isInteractive
      as="li"
      className="group flex flex-col items-center justify-start gap-6 overflow-hidden p-0!"
    >
      <div className="flex-center bg-bg-200 dark:bg-bg-800 aspect-video w-full">
        {container.cover !== '' ? (
          <img
            alt=""
            className="aspect-video size-full object-cover"
            src={
              forgeAPI.media.input({
                collectionId: container.collectionId,
                recordId: container.id,
                fieldId: container.cover,
                thumb: '0x500'
              }).endpoint
            }
          />
        ) : (
          <Icon
            className="text-bg-300 dark:text-bg-700 size-24"
            icon="tabler:bulb"
          />
        )}
      </div>
      <div className="flex flex-col items-center justify-start gap-6 p-8 pt-0">
        <div className="bg-bg-950 -mt-12 overflow-hidden rounded-lg">
          <div
            className="rounded-lg p-4"
            style={{
              backgroundColor: container.color + '30'
            }}
          >
            <Icon
              className="size-8"
              icon={container.icon}
              style={{
                color: container.color
              }}
            />
          </div>
        </div>
        <div className="text-center text-2xl font-medium">{container.name}</div>
        <div className="mt-auto flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Icon className="text-bg-500 size-5" icon="tabler:article" />
            <span className="text-bg-500">{container.text_count}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon className="text-bg-500 size-5" icon="tabler:link" />
            <span className="text-bg-500">{container.link_count}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon className="text-bg-500 size-5" icon="tabler:photo" />
            <span className="text-bg-500">{container.image_count}</span>
          </div>
        </div>
      </div>
      <Link
        className="absolute top-0 left-0 size-full"
        to={`/idea-box/${container.id}`}
      />
      <ContextMenu
        classNames={{
          wrapper: 'absolute z-[100] right-4 top-4'
        }}
      >
        <ContextMenuItem
          icon="tabler:pencil"
          label="Edit"
          onClick={handleUpdateContainer}
        />
        <ContextMenuItem
          dangerous
          icon="tabler:trash"
          label="Delete"
          onClick={handleDeleteContainer}
        />
      </ContextMenu>
    </ItemWrapper>
  )
}

export default ContainerItem
