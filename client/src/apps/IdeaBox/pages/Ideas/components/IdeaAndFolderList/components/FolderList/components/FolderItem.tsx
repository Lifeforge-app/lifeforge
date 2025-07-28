import { Icon } from '@iconify/react'
import { useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import clsx from 'clsx'
import { useDrag, useDrop } from 'react-dnd'
import { Link, useParams } from 'react-router'
import { toast } from 'react-toastify'

import type { IdeaBoxFolder } from '@apps/IdeaBox/providers/IdeaBoxProvider'

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

function FolderItem({ folder }: { folder: IdeaBoxFolder }) {
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
      await forgeAPI.ideaBox[type === 'idea' ? 'ideas' : 'folders'].moveTo
        .input({
          id: targetId
        })
        .mutate({
          target: folder.id
        })

      queryClient.invalidateQueries({
        queryKey: ['ideaBox', 'ideas']
      })

      queryClient.invalidateQueries({
        queryKey: ['ideaBox', 'folders']
      })

      queryClient.invalidateQueries({
        queryKey: ['ideaBox', 'misc', 'search']
      })
    } catch {
      toast.error('Failed to move item')
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
      <FolderContextMenu folder={folder} isOver={isOver} />
    </Link>
  )
}

export default FolderItem
