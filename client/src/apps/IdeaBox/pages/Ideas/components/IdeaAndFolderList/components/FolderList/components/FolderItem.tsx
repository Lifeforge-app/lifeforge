import { Icon } from '@iconify/react'
import { useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { useDrag, useDrop } from 'react-dnd'
import { Link, useParams } from 'react-router'
import { toast } from 'react-toastify'

import { fetchAPI } from 'shared/lib'
import {
  ISchemaWithPB,
  IdeaBoxCollectionsSchemas
} from 'shared/types/collections'

import FolderContextMenu from './FolderContextMenu'

function getStyle({
  isOver,
  canDrop,
  folderColor,
  opacity
}: {
  isOver: boolean
  canDrop: boolean
  folderColor: string
  opacity: number
}): React.CSSProperties {
  const backgroundColor = `${folderColor}${(() => {
    if (!canDrop) return '20'

    return isOver ? '' : '50'
  })()}`

  const color = (() => {
    if (!canDrop) return folderColor

    return isOver ? '' : folderColor
  })()

  return {
    backgroundColor,
    color,
    opacity
  }
}

function FolderItem({
  folder
}: {
  folder: ISchemaWithPB<IdeaBoxCollectionsSchemas.IFolder>
}) {
  const queryClient = useQueryClient()

  const { id, '*': path } = useParams<{ id: string; '*': string }>()

  const [{ opacity, isDragging }, dragRef] = useDrag(
    () => ({
      type: 'FOLDER',
      item: { targetId: folder.id, type: 'folder' },
      collect: monitor => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
        isDragging: !!monitor.isDragging()
      })
    }),
    [folder.id]
  )

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ['IDEA', 'FOLDER'],
    canDrop: (item: { targetId: string; type: 'idea' | 'folder' }) =>
      item.type === 'idea' ||
      (item.type === 'folder' && item.targetId !== folder.id),
    drop: (e: { targetId: string; type: 'idea' | 'folder' }) => {
      putIntoFolder(e).catch(console.error)
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  }))

  const putIntoFolder = async ({
    targetId,
    type
  }: {
    targetId: string
    type: 'idea' | 'folder'
  }) => {
    if (type === 'folder' && targetId === folder.id) return

    try {
      await fetchAPI(
        import.meta.env.VITE_API_HOST,
        `idea-box/${type}s/move/${targetId}?target=${folder.id}`,
        {
          method: 'POST'
        }
      )

      queryClient.invalidateQueries({
        queryKey: ['idea-box', 'ideas']
      })
    } catch {
      toast.error('Failed to move item')
    }
  }

  const removeFromFolder = async () => {
    try {
      await fetchAPI(
        import.meta.env.VITE_API_HOST,
        `idea-box/folders/move/${folder.id}`,
        {
          method: 'DELETE'
        }
      )
      queryClient.invalidateQueries({
        queryKey: ['idea-box', 'folders', id, path]
      })
    } catch {
      toast.error('Failed to remove item from folder')
    }
  }

  return (
    <Link
      key={folder.id}
      ref={node => {
        dragRef(node)
        drop(node)
      }}
      className={clsx(
        'flex-between shadow-custom relative isolate flex rounded-md p-4 font-medium backdrop-blur-xs transition-all before:absolute before:top-0 before:left-0 before:size-full before:rounded-md before:transition-all hover:before:bg-white/5',
        isOver && 'text-bg-50 dark:text-bg-800',
        isDragging && 'cursor-move'
      )}
      style={getStyle({
        isOver,
        canDrop,
        folderColor: folder.color,
        opacity
      })}
      to={`/idea-box/${id}/${path}/${folder.id}`.replace('//', '/')}
    >
      <div className="mr-2 flex w-full min-w-0 items-center">
        <Icon className="mr-2 size-5 shrink-0" icon={folder.icon} />
        <span className="w-full min-w-0 truncate">{folder.name}</span>
      </div>
      <FolderContextMenu
        folder={folder}
        isOver={isOver}
        removeFromFolder={removeFromFolder}
      />
    </Link>
  )
}

export default FolderItem
