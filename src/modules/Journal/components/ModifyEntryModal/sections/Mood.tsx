import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { Button, TextInput } from '@lifeforge/ui'

import { encrypt } from '@utils/encryption'
import fetchAPI from '@utils/fetchAPI'

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
}) {
  const [loading, setLoading] = useState(false)
  async function fetchSummarizedText() {
    setMood({
      text: '',
      emoji: ''
    })

    if (cleanedUpText === '') {
      return
    }

    setLoading(true)

    try {
      const challenge = await fetchAPI<string>('journal/auth/challenge')

      const data = await fetchAPI<{
        text: string
        emoji: string
      }>('/journal/entries/ai/mood', {
        method: 'POST',
        body: {
          text: encrypt(cleanedUpText, masterPassword),
          master: encrypt(masterPassword, challenge)
        }
      })

      setMood(data)
    } catch {
      toast.error('Failed to predict mood')
    } finally {
      setLoading(false)
    }
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
      <div className="flex-center bg-bg-200/50 shadow-custom focus-within:ring-bg-500 dark:bg-bg-800/50 mt-4 size-full flex-col rounded-lg p-6 transition-all focus-within:ring-1">
        {loading ? (
          <div className="flex size-full flex-col items-center justify-center gap-2">
            <Icon
              className="text-bg-500 size-8"
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
                setValue={value => {
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
                setValue={value => {
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
          variant="plain"
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
