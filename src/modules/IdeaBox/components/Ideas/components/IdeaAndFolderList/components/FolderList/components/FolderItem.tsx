/* eslint-disable @typescript-eslint/member-delimiter-style */
import { Icon } from '@iconify/react'
import React from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { Link, useParams } from 'react-router-dom'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import { type IIdeaBoxFolder } from '@interfaces/ideabox_interfaces'
import { useIdeaBoxContext } from '@providers/IdeaBoxProvider'
import APIRequest from '@utils/fetchData'

function FolderItem({
  folder
}: {
  folder: IIdeaBoxFolder
}): React.ReactElement {
  const {
    setEntries,
    setFolders,
    setModifyFolderModalOpenType,
    setDeleteFolderConfirmationModalOpen,
    setExistedFolder
  } = useIdeaBoxContext()
  const { id, '*': path } = useParams<{ id: string; '*': string }>()
  const [{ opacity, isDragging }, dragRef] = useDrag(
    () => ({
      type: 'FOLDER',
      item: {
        id: folder.id,
        type: 'folder'
      },
      collect: monitor => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
        isDragging: !!monitor.isDragging()
      })
    }),
    []
  )

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ['IDEA', 'FOLDER'],
    drop: (e: { id: string; type: 'idea' | 'folder' }) => {
      putIntoFolder(e).catch(console.error)
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  }))

  async function putIntoFolder({
    id,
    type
  }: {
    id: string
    type: 'idea' | 'folder'
  }): Promise<void> {
    await APIRequest({
      method: 'POST',
      endpoint: `idea-box/${type}s/move/${id}?target=${folder.id}`,
      successInfo: 'add',
      failureInfo: 'add',
      callback: () => {
        switch (type) {
          case 'idea':
            setEntries(prev => {
              if (prev === 'loading' || prev === 'error') return prev
              return prev.filter(idea => idea.id !== id)
            })
            break
          case 'folder':
            setFolders(prev => {
              if (prev === 'loading' || prev === 'error') return prev
              return prev.filter(folder => folder.id !== id)
            })
        }
      }
    })
  }

  async function removeFromFolder(): Promise<void> {
    await APIRequest({
      endpoint: `idea-box/folders/move/${folder.id}`,
      method: 'DELETE',
      successInfo: 'remove',
      failureInfo: 'remove',
      callback: () => {
        setFolders(prev => {
          if (prev === 'loading' || prev === 'error') return prev
          return prev.filter(f => f.id !== folder.id)
        })
      }
    })
  }

  return (
    <Link
      to={`/idea-box/${id}/${path}/${folder.id}`.replace('//', '/')}
      ref={stuff => {
        dragRef(stuff)
        drop(stuff)
      }}
      key={folder.id}
      className={`flex-between relative isolate flex rounded-md p-4 shadow-custom backdrop-blur-sm before:absolute before:left-0 before:top-0 before:size-full before:rounded-md before:transition-all hover:before:bg-white/5 ${
        isOver ? 'text-bg-50 dark:text-bg-800' : ''
      } ${isDragging ? 'cursor-move' : ''} font-medium transition-all`}
      style={{
        backgroundColor:
          folder.color + (!isOver ? (canDrop ? '50' : '20') : ''),
        color: !isOver ? folder.color : '',
        opacity
      }}
    >
      <div className="flex">
        <Icon icon={folder.icon} className="mr-2 size-5 shrink-0" />
        {folder.name}
      </div>
      <HamburgerMenu
        className="relative"
        customHoverColor={folder.color + '20'}
        smallerPadding
        style={{
          color: !isOver ? folder.color : ''
        }}
      >
        {folder.parent !== '' && (
          <MenuItem
            onClick={() => {
              removeFromFolder().catch(console.error)
            }}
            icon="tabler:folder-minus"
            text="Remove from folder"
          />
        )}
        <MenuItem
          onClick={() => {
            setModifyFolderModalOpenType('update')
            setExistedFolder(folder)
          }}
          icon="tabler:pencil"
          text="Edit"
        ></MenuItem>
        <MenuItem
          onClick={() => {
            setExistedFolder(folder)
            setDeleteFolderConfirmationModalOpen(true)
          }}
          icon="tabler:trash"
          text="Delete"
          isRed
        ></MenuItem>
      </HamburgerMenu>
    </Link>
  )
}

export default FolderItem
