import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import Input from '@components/ButtonsAndInputs/Input'
import { encrypt } from '@utils/encryption'
import APIRequest from '@utils/fetchData'
import { fetchChallenge } from '../../../utils/fetchChallenge'

function Mood({
  setStep,
  cleanedUpText,
  setMood,
  mood,
  masterPassword
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>
  cleanedUpText: string
  setMood: React.Dispatch<
    React.SetStateAction<{
      text: string
      emoji: string
    }>
  >
  mood: {
    text: string
    emoji: string
  }
  masterPassword: string
}): React.ReactElement {
  const [loading, setLoading] = useState(false)
  async function fetchSummarizedText(): Promise<void> {
    setMood({
      text: '',
      emoji: ''
    })

    if (cleanedUpText === '') {
      return
    }

    setLoading(true)

    const challenge = await fetchChallenge(setLoading)

    await APIRequest({
      endpoint: '/journal/entries/ai/mood',
      method: 'POST',
      body: {
        text: encrypt(cleanedUpText, masterPassword),
        master: encrypt(masterPassword, challenge)
      },
      successInfo: 'predicted',
      failureInfo: 'predicted',
      callback: data => {
        setMood(data.data)
      },
      finalCallback: () => {
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    if (mood.text !== '') {
      setLoading(false)
      return
    }

    fetchSummarizedText().catch(console.error)
  }, [])

  return (
    <>
      <div className="flex-center mt-4 size-full flex-col rounded-lg bg-bg-200/50 p-6 shadow-custom transition-all focus-within:ring-1 focus-within:ring-bg-500 dark:bg-bg-800/50">
        {loading ? (
          <div className="flex size-full flex-col items-center justify-center gap-2">
            <Icon
              icon="svg-spinners:3-dots-scale"
              className="size-8 text-bg-500"
            />
            <p className="text-bg-500">Predicting mood...</p>
          </div>
        ) : (
          <>
            <div className="w-full flex-1">
              <Input
                darker
                value={mood.text}
                icon="tabler:mood-neutral"
                name="Mood of the day"
                updateValue={value => {
                  setMood({ ...mood, text: value })
                }}
                placeholder="How do you feel?"
              />
              <Input
                darker
                value={mood.emoji}
                icon="uil:icons"
                name="Emoji"
                updateValue={value => {
                  setMood({ ...mood, emoji: value })
                }}
                placeholder="Emoji"
                className="mt-4"
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
            setStep(4)
          }}
          icon="tabler:arrow-left"
          variant="no-bg"
        >
          Previous
        </Button>
        <Button
          onClick={() => {
            setStep(6)
          }}
          icon="tabler:arrow-right"
          iconAtEnd
          disabled={mood.text.trim() === ''}
        >
          Next
        </Button>
      </div>
    </>
  )
}

export default Mood
