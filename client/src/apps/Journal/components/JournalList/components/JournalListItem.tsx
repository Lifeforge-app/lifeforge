import { Icon } from '@iconify/react'
import { ContextMenu, ContextMenuItem, useModalStore } from 'lifeforge-ui'
import moment from 'moment'

import type { JournalEntry } from '..'
import JournalViewModal from '../../JournalViewModal'

function JournalListItem({
  entry,
  masterPassword
}: {
  entry: JournalEntry
  masterPassword: string
}) {
  const open = useModalStore(state => state.open)

  async function updateEntry(id: string) {
    // setEditLoading(true)
    // try {
    //   const challenge = await fetchAPI<string>(`journal/auth/challenge`)
    //   const data = await fetchAPI<IJournalEntry>(
    //     `journal/entries/get/${id}?master=${encodeURIComponent(
    //       encrypt(masterPassword, challenge)
    //     )}`
    //   )
    //   setExistedData(data)
    //   setModifyEntryModalOpenType('update')
    // } catch {
    //   toast.error(t('fetch.fetchError'))
    // } finally {
    //   setEditLoading(false)
    // }
  }

  return (
    <button
      className="shadow-custom component-bg-with-hover w-full rounded-lg p-6 text-left"
      onClick={() => {
        open(JournalViewModal, {
          id: entry.id,
          masterPassword
        })
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
            <span className="text-bg-400 shadow-custom component-bg-lighter flex items-center gap-2 rounded-full px-3 py-1 text-base font-medium whitespace-nowrap">
              <Icon className="size-5" icon="tabler:photo" />
              {entry.photos.length} photos
            </span>
          )}
          <span className="shadow-custom component-bg-lighter block rounded-full px-3 py-1 text-base font-medium whitespace-nowrap">
            {entry.mood.emoji} {entry.mood.text}
          </span>
          <ContextMenu>
            <ContextMenuItem
              // disabled={editLoading}
              // icon={editLoading ? 'svg-spinners:180-ring' : 'tabler:pencil'}
              label="Edit"
              onClick={() => {
                updateEntry(entry.id).catch(console.error)
              }}
            />
            <ContextMenuItem
              dangerous
              icon="tabler:trash"
              label="Delete"
              onClick={() => {}}
            />
          </ContextMenu>
        </div>
      </div>
      <div className="text-bg-500 mt-4">{entry.content}</div>
    </button>
  )
}

export default JournalListItem
