import { Icon } from '@iconify/react'
import { cookieParse } from 'pocketbase'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Button } from '@components/buttons'
import { encrypt } from '@utils/encryption'
import APIRequest from '@utils/fetchData'

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
}): React.ReactElement {
  const { t } = useTranslation('modules.journal')
  const [loading, setLoading] = useState(false)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  function updateTextAreaHeight(): void {
    if (textAreaRef.current !== null) {
      textAreaRef.current.style.height = 'auto'
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px'
    }
  }

  async function fetchSummarizedText(): Promise<void> {
    setSummarizedText('')

    if (cleanedUpText === '') {
      return
    }

    setLoading(true)

    const challenge = await fetch(
      `${import.meta.env.VITE_API_HOST}/journal/auth/challenge`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        }
      }
    ).then(async res => {
      const data = await res.json()
      if (res.ok && data.state === 'success') {
        return data.data
      } else {
        toast.error(t('journal.failedToUnlock'))
        setLoading(false)

        throw new Error(t('journal.failedToUnlock'))
      }
    })

    await APIRequest({
      endpoint: '/journal/entries/ai/summarize',
      method: 'POST',
      body: {
        text: encrypt(cleanedUpText, masterPassword),
        master: encrypt(masterPassword, challenge)
      },
      successInfo: 'summarized',
      failureInfo: 'summarized',
      callback: data => {
        setSummarizedText(data.data)
        setTimeout(() => {
          updateTextAreaHeight()
        }, 100)
      },
      finalCallback: () => {
        setLoading(false)
      }
    })
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
      <div className="mt-4 size-full rounded-lg bg-bg-200/70 p-6 shadow-custom transition-all focus-within:ring-1 focus-within:ring-bg-300 dark:bg-bg-800/50 dark:focus-within:ring-bg-500">
        {loading ? (
          <div className="flex size-full flex-col items-center justify-center gap-2">
            <Icon
              className="size-8 text-bg-500"
              icon="svg-spinners:3-dots-scale"
            />
            <p className="text-bg-500">Summarizing...</p>
          </div>
        ) : (
          <>
            <div className="w-full flex-1">
              <textarea
                ref={textAreaRef}
                className="size-full flex-1 resize-none bg-transparent caret-custom-500 placeholder:text-bg-500"
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
