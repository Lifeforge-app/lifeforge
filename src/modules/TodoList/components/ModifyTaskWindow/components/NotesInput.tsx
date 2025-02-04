import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'

function NotesInput({
  notes,
  updateNotes
}: {
  notes: string
  updateNotes: (e: React.FormEvent<HTMLTextAreaElement>) => void
}): React.ReactElement {
  const { t } = useTranslation('modules.todoList')

  return (
    <div
      className="group relative mt-4 flex items-center gap-1 rounded-t-lg border-b-2 border-bg-500 bg-bg-200/50 transition-all focus-within:border-custom-500! hover:bg-bg-200 dark:bg-bg-800/50 dark:hover:bg-bg-800/50"
      onFocus={e => {
        ;(
          e.currentTarget.querySelector('textarea input') as HTMLInputElement
        )?.focus()
      }}
    >
      <Icon
        className="ml-6 size-6 shrink-0 text-bg-500 group-focus-within:text-custom-500!"
        icon="tabler:file-text"
      />
      <div className="flex w-full items-center gap-2">
        <span
          className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-bg-500 transition-all group-focus-within:!text-custom-500 ${
            notes.length === 0
              ? 'top-1/2 -translate-y-1/2 group-focus-within:top-6 group-focus-within:text-[14px]'
              : 'top-6 -translate-y-1/2 text-[14px]'
          }
          `}
        >
          {t('inputs.notes')}
        </span>
        <textarea
          className="mt-4 min-h-8 w-full resize-none rounded-lg bg-transparent p-6 pl-4 tracking-wide outline-hidden placeholder:text-transparent focus:outline-hidden focus:placeholder:text-bg-500"
          placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          value={notes}
          onInput={e => {
            e.currentTarget.style.height = 'auto'
            e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'
            updateNotes(e)
          }}
        />
      </div>
    </div>
  )
}

export default NotesInput
