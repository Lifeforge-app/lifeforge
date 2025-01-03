import { Icon } from '@iconify/react'
import React from 'react'

function IdeaContentInput({
  innerTypeOfModifyIdea,
  ideaContent,
  ideaLink,
  updateIdeaContent,
  updateIdeaLink
}: {
  innerTypeOfModifyIdea: 'text' | 'link'
  ideaContent: string
  ideaLink: string
  updateIdeaContent: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  updateIdeaLink: (e: React.ChangeEvent<HTMLInputElement>) => void
}): React.ReactElement {
  return (
    <div
      onFocus={e => {
        ;(
          e.currentTarget.querySelector('textarea input') as HTMLInputElement
        )?.focus()
      }}
      className="group relative flex items-center gap-1 rounded-t-lg border-b-2 border-bg-500 bg-bg-200/50 focus-within:!border-custom-500 dark:bg-bg-800/50"
    >
      <Icon
        icon={
          innerTypeOfModifyIdea === 'text' ? 'tabler:file-text' : 'tabler:link'
        }
        className="ml-6 size-6 shrink-0 text-bg-500 group-focus-within:!text-custom-500"
      />
      <div className="flex w-full items-center gap-2">
        <span
          className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-bg-500 transition-all group-focus-within:!text-custom-500 ${
            {
              text: ideaContent,
              link: ideaLink
            }[innerTypeOfModifyIdea].length === 0
              ? 'top-1/2 -translate-y-1/2 group-focus-within:top-6 group-focus-within:text-[14px]'
              : 'top-6 -translate-y-1/2 text-[14px]'
          }`}
        >
          {innerTypeOfModifyIdea === 'text' ? 'Idea content' : 'Link to idea'}
        </span>
        {innerTypeOfModifyIdea === 'text' ? (
          <textarea
            value={ideaContent}
            onInput={e => {
              e.currentTarget.style.height = 'auto'
              e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'
              // @ts-expect-error - Lazy to fix =)
              updateIdeaContent(e)
            }}
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, lorem euismod."
            className="mt-6 min-h-8 w-full resize-none rounded-lg bg-transparent p-6 pl-4 tracking-wide outline-none placeholder:text-transparent focus:outline-none focus:placeholder:text-bg-500"
          />
        ) : (
          <input
            value={ideaLink}
            onChange={updateIdeaLink}
            placeholder="https://example.com"
            className="mt-6 h-8 w-full rounded-lg bg-transparent p-6 pl-4 tracking-wide placeholder:text-transparent focus:outline-none focus:placeholder:text-bg-500"
          />
        )}
      </div>
    </div>
  )
}

export default IdeaContentInput
