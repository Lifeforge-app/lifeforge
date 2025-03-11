import { Icon } from '@iconify/react'
import clsx from 'clsx'
import moment from 'moment'
import React from 'react'

import { HamburgerMenu, MenuItem } from '@lifeforge/ui'

import { type IJournalEntry } from '@interfaces/journal_interfaces'

import useThemeColors from '@hooks/useThemeColor'

function JournalListItem({
  entry,
  setCurrentViewingJournal,
  setJournalViewModalOpen,
  setDeleteJournalConfirmationModalOpen,
  setExistedData,
  updateEntry,
  editLoading
}: {
  entry: IJournalEntry
  setCurrentViewingJournal: React.Dispatch<React.SetStateAction<string | null>>
  setJournalViewModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setDeleteJournalConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
  setExistedData: React.Dispatch<React.SetStateAction<IJournalEntry | null>>
  updateEntry: (id: string) => Promise<void>
  editLoading: boolean
}): React.ReactElement {
  const { componentBgWithHover, componentBgLighter } = useThemeColors()

  return (
    <button
      className={clsx(
        'shadow-custom w-full rounded-lg p-6 text-left',
        componentBgWithHover
      )}
      onClick={() => {
        setCurrentViewingJournal(entry.id)
        setJournalViewModalOpen(true)
      }}
    >
      <div className="flex-between flex">
        <div className="flex flex-col gap-2">
          <span className="text-bg-500 flex items-center gap-2 text-sm font-medium">
            {moment(entry.date).format('MMMM Do, YYYY')}
            <Icon className="size-1.5" icon="tabler:circle-filled" />
            {entry.wordCount?.toLocaleString()} words
          </span>
          <h2 className="text-2xl font-semibold">
            {entry.title === '' ? 'Untitled' : entry.title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {entry.photos.length > 0 && (
            <span
              className={clsx(
                'text-bg-400 shadow-custom flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1 text-base font-medium',
                componentBgLighter
              )}
            >
              <Icon className="size-5" icon="tabler:photo" />
              {entry.photos.length} photos
            </span>
          )}
          <span
            className={clsx(
              'shadow-custom block whitespace-nowrap rounded-full px-3 py-1 text-base font-medium',
              componentBgLighter
            )}
          >
            {entry.mood.emoji} {entry.mood.text}
          </span>
          <HamburgerMenu className="relative">
            <MenuItem
              disabled={editLoading}
              icon={editLoading ? 'svg-spinners:180-ring' : 'tabler:pencil'}
              text="Edit"
              onClick={() => {
                updateEntry(entry.id).catch(console.error)
              }}
            />
            <MenuItem
              isRed
              icon="tabler:trash"
              text="Delete"
              onClick={() => {
                setDeleteJournalConfirmationModalOpen(true)
                setExistedData(entry)
              }}
            />
          </HamburgerMenu>
        </div>
      </div>
      <div className="text-bg-500 mt-4">{entry.content}</div>
    </button>
  )
}

export default JournalListItem
