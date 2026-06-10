import { useRef, useState } from 'react'

import { TagChip } from '@/components/data-display'
import { Flex } from '@/components/primitives'

import { TextInputBox } from '../TextInput/components/TextInputBox'
import { InputActionButton } from '../shared/components/InputActionButton'
import { InputIcon } from '../shared/components/InputIcon'
import { InputInnerWrapper } from '../shared/components/InputInnerWrapper'
import { InputLabel } from '../shared/components/InputLabel'
import { InputWrapper } from '../shared/components/InputWrapper'
import { useInputLabel } from '../shared/hooks/useInputLabel'
import type { InputVariants } from '../shared/types'

/**
 * Props for the TagsInput component.
 */
interface TagsInputProps {
  /** The label text displayed above the tags input field. Required for 'classic' style. */
  label?: string
  /** The icon to display in the input field. Should be a valid icon name from Iconify. Required for 'classic' style. */
  icon?: string
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
  actionButtonProps?: {
    /** The icon to display in the action button. Should be a valid icon name from Iconify. */
    icon: string
    /** Callback function called when the action button is clicked. */
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>
  }
  /** The i18n namespace for internationalization. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details. */
  namespace?: string
  /** Error message to display when the input is invalid. */
  errorMsg?: string
}

/**
 * A tags input component that allows users to add, remove, and manage multiple tags.
 */
export function TagsInput({
  variant = 'classic',
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
}: TagsInputProps & InputVariants) {
  const inputLabel = useInputLabel({ namespace, label: label ?? '' })
  const [currentTag, setCurrentTag] = useState<string>('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  const addTag = (): void => {
    if (currentTag.trim() !== '' && value.length < maxTags) {
      if (!value.includes(currentTag.trim())) {
        onChange([...value, currentTag.trim()])
      }

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
      variant={variant}
    >
      {variant === 'classic' && icon && (
        <InputIcon
          active={String(value).length > 0}
          hasError={!!errorMsg}
          icon={icon}
        />
      )}
      <Flex
        align="center"
        gap="sm"
        minWidth="0"
        position="relative"
        width="100%"
      >
        {variant === 'classic' && label && (
          <InputLabel
            active={String(value).length > 0}
            hasError={!!errorMsg}
            label={inputLabel}
            required={required === true}
          />
        )}
        <InputInnerWrapper
          hasActionButton={!!actionButtonProps}
          minWidth="0"
          mt={variant === 'classic' ? 'sm' : undefined}
          variant={variant}
          wrap="wrap"
        >
          {value.map((tag, index) =>
            renderTags ? (
              renderTags(tag, index, () => removeTag(index))
            ) : (
              <TagChip
                key={index}
                actionButtonProps={{
                  icon: 'tabler:x',
                  onClick: () => removeTag(index)
                }}
                bg={{
                  base: 'bg-300',
                  dark: 'bg-700'
                }}
                label={tag}
                variant="filled"
              />
            )
          )}
          <TextInputBox
            autoFocus={autoFocus}
            disabled={disabled}
            inputRef={inputRef}
            placeholder={placeholder}
            style={{
              padding: 0,
              margin: 0,
              display: 'inline-block',
              width: 'min-content'
            }}
            value={currentTag}
            variant={variant}
            onBlur={addTag}
            onChange={disabled ? () => {} : setCurrentTag}
            onKeyDown={disabled ? () => {} : handleKeyDown}
          />
        </InputInnerWrapper>
      </Flex>
      {actionButtonProps?.icon && (
        <InputActionButton
          hasError={!!errorMsg}
          variant={variant}
          {...actionButtonProps}
        />
      )}
    </InputWrapper>
  )
}
