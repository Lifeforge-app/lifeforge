import { Icon } from '@iconify/react'
import { useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import React from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { Link, useParams } from 'react-router'
import { toast } from 'react-toastify'
import {
  IIdeaBoxEntry,
  type IIdeaBoxFolder
} from '@interfaces/ideabox_interfaces'
import { useIdeaBoxContext } from '@providers/IdeaBoxProvider'
import fetchAPI from '@utils/fetchAPI'
import FolderContextMenu from './FolderContextMenu'

interface FolderItemProps {
  folder: IIdeaBoxFolder
}

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

function FolderItem({ folder }: FolderItemProps): React.ReactElement {
  const {
    setModifyFolderModalOpenType,
    setDeleteFolderConfirmationModalOpen,
    setExistedFolder
  } = useIdeaBoxContext()
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
  }): Promise<void> => {
    if (type === 'folder' && targetId === folder.id) return

    try {
      await fetchAPI(`idea-box/${type}s/move/${targetId}?target=${folder.id}`, {
        method: 'POST'
      })
      queryClient.setQueryData(
        ['idea-box', type === 'idea' ? 'ideas' : 'folders', id, path],
        (prev: IIdeaBoxEntry[] | IIdeaBoxFolder[]) =>
          prev.filter(item => item.id !== targetId)
      )
    } catch {
      toast.error('Failed to move item')
    }
  }

  const removeFromFolder = async (): Promise<void> => {
    try {
      await fetchAPI(`idea-box/folders/move/${folder.id}`, {
        method: 'DELETE'
      })
      queryClient.setQueryData(
        ['idea-box', 'folders', id, path],
        (prev: IIdeaBoxFolder[]) => prev.filter(f => f.id !== folder.id)
      )
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
        'flex-between relative isolate flex rounded-md p-4 shadow-custom backdrop-blur-xs before:absolute before:left-0 before:top-0 before:size-full before:rounded-md before:transition-all hover:before:bg-white/5 font-medium transition-all',
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
      <div className="flex">
        <Icon className="mr-2 size-5 shrink-0" icon={folder.icon} />
        {folder.name}
      </div>
      <FolderContextMenu
        folder={folder}
        isOver={isOver}
        removeFromFolder={removeFromFolder}
        setDeleteFolderConfirmationModalOpen={
          setDeleteFolderConfirmationModalOpen
        }
        setExistedFolder={setExistedFolder}
        setModifyFolderModalOpenType={setModifyFolderModalOpenType}
      />
    </Link>
  )
}

export default FolderItem
