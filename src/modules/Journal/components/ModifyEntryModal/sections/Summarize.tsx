import { Icon } from '@iconify/react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import { Button } from '@lifeforge/ui'

import { encrypt } from '@utils/encryption'
import fetchAPI from '@utils/fetchAPI'

function Summarize({
  setStep,
  cleanedUpText,
  setSummarizedText,
  summarizedText,
  masterPassword
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>
  cleanedUpText: string
  setSummarizedText: React.Dispatch<React.SetStateAction<string>>
  summarizedText: string
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
    setSummarizedText('')

    if (cleanedUpText === '') {
      return
    }

    setLoading(true)

    try {
      const challenge = await fetchAPI<string>('journal/auth/challenge')

      const data = await fetchAPI<string>('/journal/entries/ai/summarize', {
        method: 'POST',
        body: {
          text: encrypt(cleanedUpText, masterPassword),
          master: encrypt(masterPassword, challenge)
        }
      })

      setSummarizedText(data)
      setTimeout(() => {
        updateTextAreaHeight()
      }, 100)
    } catch {
      toast.error('Failed to summarize text')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (summarizedText !== '') {
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
            <p className="text-bg-500">Summarizing...</p>
          </div>
        ) : (
          <>
            <div className="w-full flex-1">
              <textarea
                ref={textAreaRef}
                className="caret-custom-500 placeholder:text-bg-500 size-full flex-1 resize-none bg-transparent"
                placeholder="A short and sweet summary of your dairy entry..."
                value={summarizedText}
                onChange={e => {
                  setSummarizedText(e.target.value)
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
          variant="no-bg"
          onClick={() => {
            setStep(2)
          }}
        >
          Previous
        </Button>
        <Button
          iconAtEnd
          disabled={summarizedText?.trim() === ''}
          icon="tabler:arrow-right"
          onClick={() => {
            setStep(4)
          }}
        >
          Next
        </Button>
      </div>
    </>
  )
}

export default Summarize
