import { Icon } from '@iconify/react'
import React from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { Link, useParams } from 'react-router'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
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
      key={folder.id}
      ref={stuff => {
        dragRef(stuff)
        drop(stuff)
      }}
      className={`flex-between relative isolate flex rounded-md p-4 shadow-custom backdrop-blur-xs before:absolute before:left-0 before:top-0 before:size-full before:rounded-md before:transition-all hover:before:bg-white/5 ${
        isOver ? 'text-bg-50 dark:text-bg-800' : ''
      } ${isDragging ? 'cursor-move' : ''} font-medium transition-all`}
      style={{
        backgroundColor:
          folder.color +
          (() => {
            if (isOver) {
              return ''
            }

            return canDrop ? '50' : '20'
          })(),
        color: !isOver ? folder.color : '',
        opacity
      }}
      to={`/idea-box/${id}/${path}/${folder.id}`.replace('//', '/')}
    >
      <div className="flex">
        <Icon className="mr-2 size-5 shrink-0" icon={folder.icon} />
        {folder.name}
      </div>
      <HamburgerMenu
        smallerPadding
        className="relative"
        customHoverColor={folder.color + '20'}
        style={{
          color: !isOver ? folder.color : ''
        }}
      >
        {folder.parent !== '' && (
          <MenuItem
            icon="tabler:folder-minus"
            namespace="modules.ideaBox"
            text="Remove from folder"
            onClick={() => {
              removeFromFolder().catch(console.error)
            }}
          />
        )}
        <MenuItem
          icon="tabler:pencil"
          text="Edit"
          onClick={() => {
            setModifyFolderModalOpenType('update')
            setExistedFolder(folder)
          }}
        ></MenuItem>
        <MenuItem
          isRed
          icon="tabler:trash"
          text="Delete"
          onClick={() => {
            setExistedFolder(folder)
            setDeleteFolderConfirmationModalOpen(true)
          }}
        ></MenuItem>
      </HamburgerMenu>
    </Link>
  )
}

export default FolderItem
