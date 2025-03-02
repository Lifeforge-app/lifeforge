import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { InputIcon, InputLabel, InputWrapper } from '@components/inputs'

function TextContentInput({
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
  const { t } = useTranslation('modules.ideaBox')
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  return (
    <InputWrapper darker inputRef={inputRef}>
      <InputIcon
        active={
          {
            text: ideaContent,
            link: ideaLink
          }[innerTypeOfModifyIdea].length !== 0
        }
        icon={
          innerTypeOfModifyIdea === 'text' ? 'tabler:file-text' : 'tabler:link'
        }
      />
      <div className="flex w-full items-center gap-2">
        <InputLabel
          required
          active={
            {
              text: ideaContent,
              link: ideaLink
            }[innerTypeOfModifyIdea].length !== 0
          }
          label={
            innerTypeOfModifyIdea === 'text'
              ? t('inputs.ideaContent')
              : t('inputs.ideaLink')
          }
        />
        {innerTypeOfModifyIdea === 'text' ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            className="mt-6 min-h-8 w-full resize-none rounded-lg bg-transparent p-6 pl-4 tracking-wide outline-hidden placeholder:text-transparent focus:outline-hidden focus:placeholder:text-bg-500"
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, lorem euismod."
            value={ideaContent}
            onInput={e => {
              e.currentTarget.style.height = 'auto'
              e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'
              updateIdeaContent(e as React.ChangeEvent<HTMLTextAreaElement>)
            }}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            className="mt-6 h-8 w-full rounded-lg bg-transparent p-6 pl-4 tracking-wide placeholder:text-transparent focus:outline-hidden focus:placeholder:text-bg-500"
            placeholder="https://example.com"
            value={ideaLink}
            onChange={updateIdeaLink}
          />
        )}
      </div>
    </InputWrapper>
  )
}

export default TextContentInput
