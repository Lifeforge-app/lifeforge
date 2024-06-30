import { Icon } from '@iconify/react/dist/iconify.js'
import { cookieParse } from 'pocketbase'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import Button from '@components/ButtonsAndInputs/Button'
import { encrypt } from '@utils/encryption'
import APIRequest from '@utils/fetchData'

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
}): React.ReactElement {
  const { t } = useTranslation()
  const [loading, setLoading] = useState<boolean>(false)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  function updateTextAreaHeight(): void {
    if (textAreaRef.current !== null) {
      textAreaRef.current.style.height = 'auto'
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px'
    }
  }

  async function fetchSummarizedText(): Promise<void> {
    setCleanedUpText('')

    if (rawText === '') {
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
      endpoint: '/journal/entry/cleanup',
      method: 'POST',
      body: {
        text: encrypt(rawText, masterPassword),
        master: encrypt(masterPassword, challenge)
      },
      successInfo: 'cleanedup',
      failureInfo: 'cleanedup',
      callback: data => {
        setCleanedUpText(data.data)
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
    if (cleanedUpText !== '') {
      setLoading(false)
      updateTextAreaHeight()
      return
    }

    fetchSummarizedText().catch(console.error)
  }, [])

  return (
    <>
      <div className="flex-center mt-4 flex size-full flex-col rounded-lg bg-bg-800/50 p-6 transition-all focus-within:ring-1 focus-within:ring-bg-500">
        {loading ? (
          <div className="flex size-full flex-col items-center justify-center gap-2">
            <Icon
              icon="svg-spinners:3-dots-scale"
              className="size-8 text-bg-500"
            />
            <p className="text-bg-500">Cleaning up...</p>
          </div>
        ) : (
          <>
            <div className="w-full flex-1">
              <textarea
                ref={textAreaRef}
                className="size-full flex-1 resize-none bg-transparent caret-custom-500 placeholder:text-bg-500"
                value={cleanedUpText}
                onChange={e => {
                  setCleanedUpText(e.target.value)
                  updateTextAreaHeight()
                }}
                placeholder="A well punctuated and spell-checked version of your text..."
              />
            </div>
            <Button
              onClick={() => {
                fetchSummarizedText().catch(console.error)
              }}
              icon="tabler:refresh"
              className="mt-4 w-full shrink-0"
              variant="secondary"
            >
              Regenerate
            </Button>
          </>
        )}
      </div>
      <div className="flex-between mt-6 flex">
        <Button
          onClick={() => {
            setStep(1)
          }}
          icon="tabler:arrow-left"
          variant="no-bg"
        >
          Previous
        </Button>
        <Button
          onClick={() => {
            setStep(3)
          }}
          icon="tabler:arrow-right"
          iconAtEnd
          disabled={cleanedUpText.trim() === ''}
        >
          Next
        </Button>
      </div>
    </>
  )
}

export default Cleanup
