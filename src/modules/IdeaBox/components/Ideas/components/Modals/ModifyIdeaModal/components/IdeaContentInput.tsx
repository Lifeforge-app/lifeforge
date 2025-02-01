import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { InputIcon, InputLabel, InputWrapper } from '@components/inputs'

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
  const { t } = useTranslation('modules.ideaBox')
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
          required
          label={
            innerTypeOfModifyIdea === 'text'
              ? t('inputs.ideaContent')
              : t('inputs.ideaLink')
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
            className="mt-6 min-h-8 w-full resize-none rounded-lg bg-transparent p-6 pl-4 tracking-wide outline-hidden placeholder:text-transparent focus:outline-hidden focus:placeholder:text-bg-500"
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={ideaLink}
            onChange={updateIdeaLink}
            placeholder="https://example.com"
            className="mt-6 h-8 w-full rounded-lg bg-transparent p-6 pl-4 tracking-wide placeholder:text-transparent focus:outline-hidden focus:placeholder:text-bg-500"
          />
        )}
      </div>
    </InputWrapper>
  )
}

export default IdeaContentInput
