import { Icon } from '@iconify/react'
import React from 'react'
import { useDrop } from 'react-dnd'
import { Link, useParams } from 'react-router-dom'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import {
  type IIdeaBoxEntry,
  type IIdeaBoxFolder
} from '@interfaces/ideabox_interfaces'
import APIRequest from '@utils/fetchData'

function FolderItem({
  folder,
  setIdeaList,
  setModifyFolderModalOpenType,
  setDeleteFolderConfirmationModalOpen,
  setExistedFolderData
}: {
  folder: IIdeaBoxFolder
  setIdeaList: React.Dispatch<
    React.SetStateAction<IIdeaBoxEntry[] | 'loading' | 'error'>
  >
  setModifyFolderModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setDeleteFolderConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
  setExistedFolderData: React.Dispatch<
    React.SetStateAction<IIdeaBoxFolder | null>
  >
}): React.ReactElement {
  const { id } = useParams<{ id: string }>()
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'IDEA',
    drop: (e: { id: string }) => {
      putIntoFolder(e.id).catch(console.error)
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  }))

  async function putIntoFolder(id: string): Promise<void> {
    await APIRequest({
      method: 'POST',
      endpoint: `idea-box/folder/idea/${folder.id}`,
      body: {
        ideaId: id
      },
      successInfo: 'add',
      failureInfo: 'add',
      callback: () => {
        setIdeaList(prev => {
          if (prev === 'loading' || prev === 'error') return prev
          return prev.filter(idea => idea.id !== id)
        })
      }
    })
  }

  return (
    <Link
      to={`/idea-box/${id}/${folder.id}`}
      ref={stuff => {
        drop(stuff)
      }}
      key={folder.id}
      className={`flex flex-between rounded-md p-4 shadow-custom ${
        isOver ? 'text-bg-50 dark:text-bg-800' : ''
      } font-medium transition-all`}
      style={{
        backgroundColor:
          folder.color + (!isOver ? (canDrop ? '50' : '20') : ''),
        color: !isOver ? folder.color : ''
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
        <MenuItem
          onClick={() => {
            setModifyFolderModalOpenType('update')
            setExistedFolderData(folder)
          }}
          icon="tabler:pencil"
          text="Edit"
        ></MenuItem>
        <MenuItem
          onClick={() => {
            setExistedFolderData(folder)
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
