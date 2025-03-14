import { Icon } from '@iconify/react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import { Button } from '@lifeforge/ui'

import fetchAPI from '@utils/fetchAPI'

import { encrypt } from '../../../../../core/security/utils/encryption'

function Cleanup({
  setStep,
  rawText,
  setCleanedUpText,
  cleanedUpText,
  masterPassword
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>
  rawText: string
  setCleanedUpText: React.Dispatch<React.SetStateAction<string>>
  cleanedUpText: string
  masterPassword: string
}) {
  const [loading, setLoading] = useState(false)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  function updateTextAreaHeight() {
    if (textAreaRef.current !== null) {
      textAreaRef.current.style.height = 'auto'
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px'
    }
  }

  async function fetchSummarizedText() {
    setCleanedUpText('')

    if (rawText === '') {
      return
    }

    setLoading(true)

    try {
      const challenge = await fetchAPI<string>(`journal/auth/challenge`)

      const data = await fetchAPI<string>('journal/entries/ai/cleanup', {
        method: 'POST',
        body: {
          text: encrypt(rawText, masterPassword),
          master: encrypt(masterPassword, challenge)
        }
      })

      setCleanedUpText(data)
      setTimeout(() => {
        updateTextAreaHeight()
      }, 100)
    } catch {
      toast.error('Failed to clean up text')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (cleanedUpText !== '') {
      setLoading(false)
      updateTextAreaHeight()
      return
    }

    fetchSummarizedText().catch(console.error)
  }, [])

  return (
    <>
      <div className="bg-bg-200/70 shadow-custom focus-within:ring-bg-300 dark:bg-bg-800/50 dark:focus-within:ring-bg-500 mt-4 size-full rounded-lg p-6 transition-all focus-within:ring-1">
        {loading ? (
          <div className="flex size-full flex-col items-center justify-center gap-2">
            <Icon
              className="text-bg-500 size-8"
              icon="svg-spinners:3-dots-scale"
            />
            <p className="text-bg-500">Cleaning up...</p>
          </div>
        ) : (
          <>
            <div className="w-full flex-1">
              <textarea
                ref={textAreaRef}
                className="caret-custom-500 placeholder:text-bg-500 size-full flex-1 resize-none bg-transparent"
                placeholder="A well punctuated and spell-checked version of your text..."
                value={cleanedUpText}
                onChange={e => {
                  setCleanedUpText(e.target.value)
                  updateTextAreaHeight()
                }}
              />
            </div>
            <Button
              className="mt-4 w-full shrink-0"
              icon="tabler:refresh"
              variant="secondary"
              onClick={() => {
                fetchSummarizedText().catch(console.error)
              }}
            >
              Regenerate
            </Button>
          </>
        )}
      </div>
      <div className="flex-between mt-6 flex">
        <Button
          icon="tabler:arrow-left"
          variant="plain"
          onClick={() => {
            setStep(1)
          }}
        >
          Previous
        </Button>
        <Button
          iconAtEnd
          disabled={cleanedUpText.trim() === ''}
          icon="tabler:arrow-right"
          onClick={() => {
            setStep(3)
          }}
        >
          Next
        </Button>
      </div>
    </>
  )
}

export default Cleanup
