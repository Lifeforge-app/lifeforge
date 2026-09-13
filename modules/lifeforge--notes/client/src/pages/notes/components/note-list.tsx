import { SearchInput } from '@lifeforge/ui'

import type { Note } from '@/entities/note'

function getNoteClassName(isSelected: boolean) {
  const baseClassName =
    'w-full rounded-lg border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
  const selectedClassName =
    'border-primary bg-primary/10 shadow-sm dark:bg-primary/20'
  const defaultClassName =
    'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700'

  return `${baseClassName} ${isSelected ? selectedClassName : defaultClassName}`
}

function NoteListItem({
  note,
  isSelected,
  onSelect
}: {
  note: Note
  isSelected: boolean
  onSelect: () => void
}) {
  const preview = note.content || 'No content'

  return (
    <button
      aria-pressed={isSelected}
      className={getNoteClassName(isSelected)}
      type="button"
      onClick={onSelect}
    >
      <h2 className="truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50">
        {note.title}
      </h2>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        {preview}
      </p>
    </button>
  )
}

function NoteResults({
  notes,
  selectedNoteId,
  onSelect
}: {
  notes: Note[]
  selectedNoteId: string | null
  onSelect: (id: string) => void
}) {
  if (notes.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          No notes found
        </p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Try a different search or create a new note.
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
      {notes.map(note => (
        <NoteListItem
          key={note.id}
          isSelected={selectedNoteId === note.id}
          note={note}
          onSelect={() => onSelect(note.id)}
        />
      ))}
    </div>
  )
}

export function NoteList({
  notes,
  searchQuery,
  selectedNoteId,
  onSearchChange,
  onSearch,
  onSelect
}: {
  notes: Note[]
  searchQuery: string
  selectedNoteId: string | null
  onSearchChange: (value: string) => void
  onSearch: () => void
  onSelect: (id: string) => void
}) {
  return (
    <section className="flex min-h-80 min-w-0 flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/50">
      <div className="flex items-end gap-3">
        <div className="min-w-0 flex-1">
          <SearchInput
            className="shadow-none"
            debounceMs={300}
            namespace={false}
            searchTarget="notes"
            value={searchQuery}
            onChange={onSearchChange}
            onEnter={onSearch}
          />
        </div>
        <button
          className="inline-flex h-[3.25rem] shrink-0 items-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          type="button"
          onClick={onSearch}
        >
          Search
        </button>
      </div>
      <NoteResults
        notes={notes}
        selectedNoteId={selectedNoteId}
        onSelect={onSelect}
      />
    </section>
  )
}
