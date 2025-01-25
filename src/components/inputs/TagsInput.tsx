import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'
import InputBox from './shared/InputBox'
import InputIcon from './shared/InputIcon'
import InputLabel from './shared/InputLabel'
import InputWrapper from './shared/InputWrapper'
import Button from '../buttons/Button'

interface ITagsInputProps {
  name: string
  icon: string
  placeholder: string
  value: string[]
  updateValue: (tags: string[]) => void
  needTranslate?: boolean
  maxTags?: number
  disabled?: boolean
  className?: string
  darker?: boolean
  existedTags?: Array<{
    name: string
    icon: string
    color: string
  }>
  required?: boolean
}

function TagsInput({
  name,
  icon,
  placeholder,
  value,
  updateValue,
  needTranslate = true,
  maxTags = 100,
  disabled = false,
  className = '',
  darker,
  existedTags,
  required
}: ITagsInputProps): React.ReactElement {
  const { t } = useTranslation()
  const [currentTag, setCurrentTag] = useState<string>('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  const addTag = (): void => {
    if (currentTag.trim() !== '' && value.length < maxTags) {
      updateValue([...value, currentTag.trim()])
      setCurrentTag('')
    }
  }

  const removeTag = (index: number): void => {
    const newTags = value.filter((_, i) => i !== index)
    updateValue(newTags)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Backspace' && currentTag === '' && value.length > 0) {
      removeTag(value.length - 1)
    }
  }

  return (
    <InputWrapper
      className={`${className}`}
      disabled={disabled}
      darker={darker}
      inputRef={inputRef}
    >
      <InputIcon icon={icon} active={String(value).length > 0} />
      <div className="flex w-full items-center gap-2">
        <InputLabel
          required={required === true}
          label={needTranslate ? t(`input.${toCamelCase(name)}`) : name}
          active={String(value).length > 0}
        />
        <div className="mb-4 ml-[14px] mt-12 flex flex-wrap items-center gap-2">
          {value.map((tag, index) => {
            const existedTag = existedTags?.find(t => t.name === tag)

            return (
              <div
                key={index}
                className="flex items-center rounded-full bg-bg-200 py-1 pl-3 pr-2 dark:bg-bg-700/50"
              >
                {existedTag !== undefined && (
                  <Icon
                    icon={existedTag.icon}
                    className="mr-2 size-3"
                    style={{ color: existedTag.color }}
                  />
                )}
                <span className="mr-2 text-sm">{tag}</span>
                {!disabled && (
                  <Button
                    variant="no-bg"
                    icon="tabler:x"
                    onClick={() => {
                      removeTag(index)
                    }}
                    className="!m-0 !h-4 !w-4 !p-0"
                    iconClassName="size-3"
                  />
                )}
              </div>
            )
          })}
          {!disabled && (
            <InputBox
              inputRef={inputRef}
              value={currentTag}
              updateValue={setCurrentTag}
              placeholder={placeholder}
              onKeyDown={handleKeyDown}
              noAutoComplete
              onBlur={addTag}
              className="!my-0 !w-auto flex-1 py-0 !pl-0"
            />
          )}
        </div>
      </div>
    </InputWrapper>
  )
}

export default TagsInput
