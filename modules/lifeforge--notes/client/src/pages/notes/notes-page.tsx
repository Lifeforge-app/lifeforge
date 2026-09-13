import { useQuery, useQueryClient } from '@tanstack/react-query'

import { ModuleHeaderTailwind, useModalStore } from '@lifeforge/ui'

import type { Note } from '@/entities/note'
import { NoteFormModal } from '@/features/edit-note'
import { useNoteFilter } from '@/hooks/use-note-filter'
import { forgeAPI } from '@/manifest'

import { NoteDetail } from './components/note-detail'
import { NoteList } from './components/note-list'

function CreateNoteButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      type="button"
      onClick={onClick}
    >
      <span aria-hidden="true">+</span>
      New note
    </button>
  )
}

function NotesLoading() {
  return (
    <div className="flex min-h-80 items-center justify-center rounded-xl border border-zinc-200 bg-white p-8 text-sm text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-400">
      Loading notes...
    </div>
  )
}

function NotesError() {
  return (
    <div
      className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
      role="alert"
    >
      Unable to load notes.
    </div>
  )
}

function NotesContent({
  notes,
  isPending,
  isError,
  selectedNote,
  selectedNoteId,
  searchQuery,
  onSearchChange,
  onSearch,
  onSelect,
  onClearSelection
}: {
  notes: Note[]
  isPending: boolean
  isError: boolean
  selectedNote: Note | null
  selectedNoteId: string | null
  searchQuery: string
  onSearchChange: (value: string) => void
  onSearch: () => void
  onSelect: (id: string) => void
  onClearSelection: () => void
}) {
  if (isPending) return <NotesLoading />
  if (isError) return <NotesError />

  return (
    <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.6fr)]">
      <NoteList
        notes={notes}
        searchQuery={searchQuery}
        selectedNoteId={selectedNoteId}
        onSearch={onSearch}
        onSearchChange={onSearchChange}
        onSelect={onSelect}
      />
      <NoteDetail note={selectedNote} onClearSelection={onClearSelection} />
    </div>
  )
}

export function NotesPage() {
  const { open } = useModalStore()
  const queryClient = useQueryClient()

  const { searchQuery, selectedNoteId, setSearchQuery, setSelectedNoteId } =
    useNoteFilter()
  const notesQuery = useQuery(
    forgeAPI.notes.list
      .input({ query: searchQuery || undefined })
      .queryOptions()
  )
  const notes = notesQuery.data ?? []
  const selectedNote = notes.find(note => note.id === selectedNoteId) ?? null

  function openCreateModal() {
    open(NoteFormModal, { type: 'create' })
  }

  function handleSearchChange(value: string) {
    void setSearchQuery(value)
  }

  function handleSearch() {
    void queryClient.invalidateQueries({ queryKey: forgeAPI.notes.key })
  }

  function handleSelect(id: string) {
    void setSelectedNoteId(id)
  }

  function clearSelection() {
    void setSelectedNoteId(null)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 pb-6 pt-2 sm:px-6">
      <ModuleHeaderTailwind
        namespace={false}
        trailing={<CreateNoteButton onClick={openCreateModal} />}
      />
      <main className="flex min-h-0 flex-1 flex-col">
        <NotesContent
          isError={notesQuery.isError}
          isPending={notesQuery.isPending}
          notes={notes}
          searchQuery={searchQuery}
          selectedNote={selectedNote}
          selectedNoteId={selectedNoteId}
          onClearSelection={clearSelection}
          onSearch={handleSearch}
          onSearchChange={handleSearchChange}
          onSelect={handleSelect}
        />
      </main>
    </div>
  )
}
