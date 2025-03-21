import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { Button, InputIcon, InputLabel, InputWrapper } from '@lifeforge/ui'

import fetchAPI from '@utils/fetchAPI'

function TextType({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useTranslation('apps.momentVault')
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLTextAreaElement | null>(null)
  const [submitLoading, setSubmitLoading] = useState(false)

  useEffect(() => {
    if (!inputRef.current) return

    inputRef.current.style.height = 'auto'
    inputRef.current.style.height = inputRef.current.scrollHeight + 'px'
  }, [text])

  async function onSubmit() {
    setSubmitLoading(true)
    try {
      await fetchAPI('moment-vault/entries', {
        method: 'POST',
        body: {
          type: 'text',
          content: text
        }
      })

      onSuccess()
    } catch (err) {
      console.error(err)
      toast.error('Failed to create text entry')
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <>
      <InputWrapper darker inputRef={inputRef}>
        <InputIcon active={text.length !== 0} icon="tabler:file-text" />
        <div className="flex w-full items-center gap-2">
          <InputLabel
            required
            active={text.length !== 0}
            label={t('inputs.textContent')}
          />
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            className="focus:placeholder:text-bg-500 outline-hidden focus:outline-hidden mt-6 min-h-8 w-full resize-none rounded-lg bg-transparent p-6 pl-4 tracking-wide placeholder:text-transparent"
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, lorem euismod."
            value={text}
            onInput={e => {
              setText(e.currentTarget.value)
            }}
          />
        </div>
      </InputWrapper>
      <Button
        className="mt-6 w-full"
        disabled={text.trim().length === 0}
        icon="tabler:plus"
        loading={submitLoading}
        onClick={onSubmit}
      >
        Create
      </Button>
    </>
  )
}

export default TextType
