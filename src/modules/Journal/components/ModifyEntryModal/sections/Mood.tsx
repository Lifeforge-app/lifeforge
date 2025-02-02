import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import { Button } from '@components/buttons'
import { TextInput } from '@components/inputs'
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
              className="size-8 text-bg-500"
              icon="svg-spinners:3-dots-scale"
            />
            <p className="text-bg-500">Predicting mood...</p>
          </div>
        ) : (
          <>
            <div className="w-full flex-1">
              <TextInput
                darker
                icon="tabler:mood-neutral"
                name="Mood of the day"
                namespace="modules.journal"
                placeholder="How do you feel?"
                updateValue={value => {
                  setMood({ ...mood, text: value })
                }}
                value={mood.text}
              />
              <TextInput
                darker
                className="mt-4"
                icon="uil:icons"
                name="Emoji"
                namespace="modules.journal"
                placeholder="Emoji"
                updateValue={value => {
                  setMood({ ...mood, emoji: value })
                }}
                value={mood.emoji}
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
            setStep(4)
          }}
        >
          Previous
        </Button>
        <Button
          iconAtEnd
          disabled={mood.text.trim() === ''}
          icon="tabler:arrow-right"
          onClick={() => {
            setStep(6)
          }}
        >
          Next
        </Button>
      </div>
    </>
  )
}

export default Mood
