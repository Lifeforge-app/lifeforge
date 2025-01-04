import { t } from 'i18next'
import React, { useRef } from 'react'
import InputIcon from '@components/ButtonsAndInputs/Input/components/InputIcon'
import InputLabel from '@components/ButtonsAndInputs/Input/components/InputLabel'
import InputWrapper from '@components/ButtonsAndInputs/Input/components/InputWrapper'

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
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  return (
    <InputWrapper darker inputRef={inputRef}>
      <InputIcon
        icon={
          innerTypeOfModifyIdea === 'text' ? 'tabler:file-text' : 'tabler:link'
        }
        active={
          {
            text: ideaContent,
            link: ideaLink
          }[innerTypeOfModifyIdea].length !== 0
        }
      />
      <div className="flex w-full items-center gap-2">
        <InputLabel
          label={
            innerTypeOfModifyIdea === 'text'
              ? t('input.ideaContent')
              : t('input.ideaLink')
          }
          active={
            {
              text: ideaContent,
              link: ideaLink
            }[innerTypeOfModifyIdea].length !== 0
          }
        />
        {innerTypeOfModifyIdea === 'text' ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={ideaContent}
            onInput={e => {
              e.currentTarget.style.height = 'auto'
              e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'
              updateIdeaContent(e as React.ChangeEvent<HTMLTextAreaElement>)
            }}
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, lorem euismod."
            className="mt-6 min-h-8 w-full resize-none rounded-lg bg-transparent p-6 pl-4 tracking-wide outline-none placeholder:text-transparent focus:outline-none focus:placeholder:text-bg-500"
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={ideaLink}
            onChange={updateIdeaLink}
            placeholder="https://example.com"
            className="mt-6 h-8 w-full rounded-lg bg-transparent p-6 pl-4 tracking-wide placeholder:text-transparent focus:outline-none focus:placeholder:text-bg-500"
          />
        )}
      </div>
    </InputWrapper>
  )
}

export default IdeaContentInput
