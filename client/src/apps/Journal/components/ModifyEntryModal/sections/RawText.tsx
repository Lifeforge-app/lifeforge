import { Button } from 'lifeforge-ui'
import { useEffect, useRef } from 'react'

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
}) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  function updateTextAreaHeight() {
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
      <div className="bg-bg-200/70 shadow-custom focus-within:ring-bg-300 dark:bg-bg-800/50 dark:focus-within:ring-bg-500 mt-4 size-full rounded-lg p-6 transition-all focus-within:ring-1">
        <textarea
          ref={textAreaRef}
          className="caret-custom-500 placeholder:text-bg-500 h-max w-full resize-none bg-transparent"
          placeholder="What a beautiful day! Start writing here..."
          value={rawText}
          onChange={e => {
            setRawText(e.target.value)
          }}
        />
      </div>
      <Button
        iconAtEnd
        className="mt-6"
        disabled={rawText.trim() === ''}
        icon="tabler:arrow-right"
        onClick={() => {
          if (rawText.trim() !== '') setStep(2)
        }}
      >
        Next
      </Button>
    </>
  )
}

export default RawText
