import { useForgeMutation } from '@lifeforge/api'
import { ConfirmationModal, Icon, useModalStore } from '@lifeforge/ui'

import type { Note } from '@/entities/note'
import { NoteFormModal } from '@/features/edit-note'
import { forgeAPI } from '@/manifest'

function NoteDetailEmpty() {
  return (
    <section className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-950/50">
      <Icon
        aria-hidden="true"
        className="text-zinc-300 dark:text-zinc-700"
        icon="tabler:note"
        size="3rem"
      />
      <h2 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Select a note
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        Choose a note from the list to read and edit it.
      </p>
    </section>
  )
}

export function NoteDetail({
  note,
  onClearSelection
}: {
  note: Note | null
  onClearSelection: () => void
}) {
  const { open } = useModalStore()

  const deleteMutation = useForgeMutation(
    forgeAPI.notes.remove.input({ id: note?.id ?? '' }),
    {
      action: 'delete',
      queryKey: forgeAPI.notes.key
    }
  )

  if (note === null) return <NoteDetailEmpty />

  const currentNote = note

  function openEditModal() {
    open(NoteFormModal, { initialData: currentNote, type: 'update' })
  }

  function openDeleteModal() {
    open(ConfirmationModal, {
      confirmationButton: 'delete',
      description: `This will permanently delete “${currentNote.title}”.`,
      onConfirm: async () => {
        await deleteMutation.mutateAsync(undefined)
        onClearSelection()
      },
      title: 'Delete note?'
    })
  }

  const updatedLabel = new Date(currentNote.updated).toLocaleString()

  return (
    <article className="flex min-h-80 min-w-0 flex-col rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/50">
      <header className="flex items-start justify-between gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <div className="min-w-0">
          <h2 className="break-words text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            {currentNote.title}
          </h2>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Updated {updatedLabel}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            aria-label={`Edit ${currentNote.title}`}
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            type="button"
            onClick={openEditModal}
          >
            <Icon aria-hidden="true" icon="tabler:pencil" />
          </button>
          <button
            aria-label={`Delete ${currentNote.title}`}
            className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:hover:bg-red-950/40"
            type="button"
            onClick={openDeleteModal}
          >
            <Icon aria-hidden="true" icon="tabler:trash" />
          </button>
        </div>
      </header>
      <p className="whitespace-pre-wrap break-words pt-6 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
        {currentNote.content || 'No content'}
      </p>
    </article>
  )
}
