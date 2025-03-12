import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

function NotesInput({
  notes,
  updateNotes
}: {
  notes: string
  updateNotes: (e: React.FormEvent<HTMLTextAreaElement>) => void
}) {
  const { t } = useTranslation('modules.todoList')

  return (
    <div
      className="border-bg-500 bg-bg-200/50 focus-within:border-custom-500! hover:bg-bg-200 dark:bg-bg-800/50 dark:hover:bg-bg-800/50 group relative mt-4 flex items-center gap-1 rounded-t-lg border-b-2 transition-all"
      onFocus={e => {
        ;(
          e.currentTarget.querySelector('textarea input') as HTMLInputElement
        )?.focus()
      }}
    >
      <Icon
        className="text-bg-500 group-focus-within:text-custom-500! ml-6 size-6 shrink-0"
        icon="tabler:file-text"
      />
      <div className="flex w-full items-center gap-2">
        <span
          className={clsx(
            'text-bg-500 group-focus-within:!text-custom-500 pointer-events-none absolute left-[4.2rem] font-medium tracking-wide transition-all',
            notes.length === 0
              ? 'top-1/2 -translate-y-1/2 group-focus-within:top-6 group-focus-within:text-[14px]'
              : 'top-6 -translate-y-1/2 text-[14px]'
          )}
        >
          {t('inputs.notes')}
        </span>
        <textarea
          className="focus:placeholder:text-bg-500 outline-hidden focus:outline-hidden mt-4 min-h-8 w-full resize-none rounded-lg bg-transparent p-6 pl-4 tracking-wide placeholder:text-transparent"
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
