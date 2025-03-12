import moment from 'moment'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

import { Button } from '@lifeforge/ui'

import { encrypt } from '@utils/encryption'
import fetchAPI from '@utils/fetchAPI'

import JournalView from '../../JournalView'

function Review({
  id,
  date,
  title,
  setStep,
  rawText,
  cleanedUpText,
  summarizedText,
  photos,
  mood,
  masterPassword,
  onClose,
  openType
}: {
  id: string
  date: string
  title: string
  setStep: React.Dispatch<React.SetStateAction<number>>
  rawText: string
  cleanedUpText: string
  summarizedText: string
  photos:
    | Array<{
        file: File
        preview: string
      }>
    | string[]
  mood: {
    text: string
    emoji: string
  }
  masterPassword: string
  onClose: () => void
  openType: 'create' | 'update' | null
}): React.ReactElement {
  const [loading, setLoading] = useState(false)

  async function onSubmit(): Promise<void> {
    setLoading(true)

    try {
      const challenge = await fetchAPI<string>('journal/auth/challenge')

      const encryptedTitle = encrypt(title, masterPassword)
      const encryptedRaw = encrypt(rawText, masterPassword)
      const encryptedCleanedUp = encrypt(cleanedUpText, masterPassword)
      const encryptedSummarized = encrypt(summarizedText, masterPassword)
      const encryptedMood = encrypt(JSON.stringify(mood), masterPassword)

      const encryptedMaster = encrypt(masterPassword, challenge)

      const encryptedEverything = encrypt(
        JSON.stringify({
          date: moment(date).format('YYYY-MM-DD'),
          title: encryptedTitle,
          raw: encryptedRaw,
          cleanedUp: encryptedCleanedUp,
          summarized: encryptedSummarized,
          mood: encryptedMood,
          master: encryptedMaster
        }),
        challenge
      )

      const formData = new FormData()
      formData.append('data', encryptedEverything)
      if (photos.every(p => typeof p === 'object')) {
        photos.forEach(photo => {
          formData.append('files', photo.file)
        })
      }

      await fetchAPI(
        `journal/entries/${openType}${openType === 'update' ? '/' + id : ''}`,
        {
          method: openType === 'update' ? 'PUT' : 'POST',
          body: formData
        }
      )

      onClose()
      setStep(1)
    } catch {
      toast.error('Failed to create/update journal entry')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <JournalView
        cleanedUpText={cleanedUpText}
        date={date}
        mood={mood}
        photos={photos}
        rawText={rawText}
        summarizedText={summarizedText}
        title={title}
      />
      <div className="flex-between mt-6 flex">
        <Button
          icon="tabler:arrow-left"
          variant="no-bg"
          onClick={() => {
            setStep(5)
          }}
        >
          Previous
        </Button>
        <Button
          iconAtEnd
          disabled={summarizedText.trim() === ''}
          icon="tabler:arrow-right"
          loading={loading}
          onClick={() => {
            onSubmit().catch(console.error)
          }}
        >
          {openType === 'update' ? 'Update' : 'Create'}
        </Button>
      </div>
    </>
  )
}

export default Review
