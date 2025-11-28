import { useRef, useState } from 'react'

import Button from '../controls/Button'
import TextInputBox from './TextInput/components/TextInputBox'
import InputIcon from './shared/components/InputIcon'
import InputLabel from './shared/components/InputLabel'
import InputWrapper from './shared/components/InputWrapper'
import useInputLabel from './shared/hooks/useInputLabel'

/**
 * Props for the TagsInput component.
 */
interface TagsInputProps {
  /** The label text displayed above the tags input field. */
  label: string
  /** The icon to display in the input field. Should be a valid icon name from Iconify. */
  icon: string
  /** The placeholder text displayed when the input is empty. */
  placeholder: string
  /** The current array of tag values. */
  value: string[]
  /** Callback function called when the tags array changes. */
  onChange: (tags: string[]) => void
  /** Whether the field is required for form validation. */
  required?: boolean
  /** Whether the input is disabled and non-interactive. */
  disabled?: boolean
  /** Whether the input should automatically focus when rendered. */
  autoFocus?: boolean
  /** The maximum number of tags allowed. */
  maxTags?: number
  /** Custom render function for individual tags. */
  renderTags?: (
    tag: string,
    index: number,
    onRemoveTag: () => void
  ) => React.ReactNode
  /** Additional CSS class names to apply to the input container. */
  className?: string
  /** Properties for constructing the action button component at the right hand side. */
  actionButtonProps?: React.ComponentProps<typeof Button>
  /** The i18n namespace for internationalization. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details. */
  namespace?: string
  /** Error message to display when the input is invalid. */
  errorMsg?: string
}

/**
 * A tags input component that allows users to add, remove, and manage multiple tags.
 */
function TagsInput({
  label,
  icon,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  autoFocus = false,
  maxTags = 100,
  renderTags,
  className = '',
  actionButtonProps,
  namespace,
  errorMsg
}: TagsInputProps) {
  const inputLabel = useInputLabel({ namespace, label })

  const [currentTag, setCurrentTag] = useState<string>('')

  const inputRef = useRef<HTMLInputElement | null>(null)

  const addTag = (): void => {
    if (currentTag.trim() !== '' && value.length < maxTags) {
      onChange([...value, currentTag.trim()])
      setCurrentTag('')
    }
  }

  const removeTag = (index: number): void => {
    const newTags = value.filter((_, i) => i !== index)

    onChange(newTags)
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
      className={className}
      disabled={disabled}
      errorMsg={errorMsg}
      inputRef={inputRef}
    >
      <InputIcon
        active={String(value).length > 0}
        hasError={!!errorMsg}
        icon={icon}
      />
      <div className="flex w-full items-center gap-2">
        <InputLabel
          active={String(value).length > 0}
          hasError={!!errorMsg}
          label={inputLabel}
          required={required === true}
        />
        <div className="mt-10 mb-4 ml-[14px] flex w-full flex-wrap items-center gap-2">
          {value.map((tag, index) =>
            renderTags ? (
              renderTags(tag, index, () => removeTag(index))
            ) : (
              <div
                key={index}
                className="component-bg shadow-custom flex items-center rounded-full py-1 pr-2 pl-3"
              >
                <span className="mr-2 text-sm">{tag}</span>
                {!disabled && (
                  <Button
                    className="m-0! h-4! w-4! p-0!"
                    icon="tabler:x"
                    iconClassName="size-3"
                    variant="plain"
                    onClick={() => {
                      removeTag(index)
                    }}
                  />
                )}
              </div>
            )
          )}
          {!disabled && (
            <TextInputBox
              autoFocus={autoFocus}
              className="my-0! h-auto w-min! py-0 pl-0!"
              inputRef={inputRef}
              placeholder={placeholder}
              value={currentTag}
              onBlur={addTag}
              onChange={setCurrentTag}
              onKeyDown={handleKeyDown}
            />
          )}
        </div>
        {actionButtonProps && (
          <Button
            className="mr-4 p-2!"
            variant="plain"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()

              actionButtonProps.onClick?.(e)
            }}
            {...actionButtonProps}
          />
        )}
      </div>
    </InputWrapper>
  )
}

export default TagsInput
