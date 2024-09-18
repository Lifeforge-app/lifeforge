import React, { useEffect, useRef } from 'react'
import Button from '@components/ButtonsAndInputs/Button'

function RawText({
  openType,
  rawText,
  setRawText,
  setStep
}: {
  openType: 'create' | 'update' | null
  rawText: string
  setRawText: React.Dispatch<React.SetStateAction<string>>
  setStep: React.Dispatch<React.SetStateAction<number>>
}): React.ReactElement {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  function updateTextAreaHeight(): void {
    if (textAreaRef.current !== null) {
      textAreaRef.current.style.height = 'auto'
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px'
    }
  }

  useEffect(() => {
    updateTextAreaHeight()
  }, [rawText])

  useEffect(() => {
    if (openType === null) return

    setTimeout(() => {
      updateTextAreaHeight()
    }, 500)
  }, [openType])

  return (
    <>
      <div className="mt-4 size-full rounded-lg bg-bg-200/70 p-6 shadow-custom transition-all focus-within:ring-1 focus-within:ring-bg-300 dark:bg-bg-800/50 dark:focus-within:ring-bg-500">
        <textarea
          ref={textAreaRef}
          className="h-max w-full resize-none bg-transparent caret-custom-500 placeholder:text-bg-500"
          placeholder="What a beautiful day! Start writing here..."
          value={rawText}
          onChange={e => {
            setRawText(e.target.value)
          }}
        />
      </div>
      <Button
        className="mt-6"
        disabled={rawText.trim() === ''}
        onClick={() => {
          if (rawText.trim() !== '') setStep(2)
        }}
        icon="tabler:arrow-right"
        iconAtEnd
      >
        Next
      </Button>
    </>
  )
}

export default RawText
