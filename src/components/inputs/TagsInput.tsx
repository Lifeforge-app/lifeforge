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
  setValue: (tags: string[]) => void
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
  namespace: string
  tKey?: string
}

function TagsInput({
  name,
  icon,
  placeholder,
  value,
  setValue,
  maxTags = 100,
  disabled = false,
  className = '',
  darker,
  existedTags,
  required,
  namespace,
  tKey = ''
}: ITagsInputProps): React.ReactElement {
  const { t } = useTranslation(namespace)
  const [currentTag, setCurrentTag] = useState<string>('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  const addTag = (): void => {
    if (currentTag.trim() !== '' && value.length < maxTags) {
      setValue([...value, currentTag.trim()])
      setCurrentTag('')
    }
  }

  const removeTag = (index: number): void => {
    const newTags = value.filter((_, i) => i !== index)
    setValue(newTags)
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
      darker={darker}
      disabled={disabled}
      inputRef={inputRef}
    >
      <InputIcon active={String(value).length > 0} icon={icon} />
      <div className="flex w-full items-center gap-2">
        <InputLabel
          active={String(value).length > 0}
          label={t([
            [tKey, 'inputs', toCamelCase(name)].filter(e => e).join('.'),
            [tKey, 'inputs', toCamelCase(name), 'label']
              .filter(e => e)
              .join('.')
          ])}
          required={required === true}
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
                    className="mr-2 size-3"
                    icon={existedTag.icon}
                    style={{ color: existedTag.color }}
                  />
                )}
                <span className="mr-2 text-sm">{tag}</span>
                {!disabled && (
                  <Button
                    className="m-0! h-4! w-4! p-0!"
                    icon="tabler:x"
                    iconClassName="size-3"
                    variant="no-bg"
                    onClick={() => {
                      removeTag(index)
                    }}
                  />
                )}
              </div>
            )
          })}
          {!disabled && (
            <InputBox
              noAutoComplete
              className="my-0! w-auto! flex-1 py-0 pl-0!"
              inputRef={inputRef}
              placeholder={placeholder}
              setValue={setCurrentTag}
              value={currentTag}
              onBlur={addTag}
              onKeyDown={handleKeyDown}
            />
          )}
        </div>
      </div>
    </InputWrapper>
  )
}

export default TagsInput
