import moment from 'moment'
import React, { useState } from 'react'
import { Button } from '@components/buttons'
import { encrypt } from '@utils/encryption'
import APIRequest from '@utils/fetchData'
import { fetchChallenge } from '../../../utils/fetchChallenge'
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

    const challenge = await fetchChallenge(setLoading)

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

    await APIRequest({
      endpoint: `journal/entries/${openType}${
        openType === 'update' ? `/${id}` : ''
      }`,
      method: openType === 'update' ? 'PUT' : 'POST',
      isJSON: false,
      body: formData,
      successInfo: openType,
      failureInfo: openType,
      callback: () => {
        onClose()
        setStep(1)
      },
      finalCallback: () => {
        setLoading(false)
      }
    })
  }

  return (
    <>
      <JournalView
        date={date}
        title={title}
        mood={mood}
        cleanedUpText={cleanedUpText}
        summarizedText={summarizedText}
        rawText={rawText}
        photos={photos}
      />
      <div className="flex-between mt-6 flex">
        <Button
          onClick={() => {
            setStep(5)
          }}
          icon="tabler:arrow-left"
          variant="no-bg"
        >
          Previous
        </Button>
        <Button
          onClick={() => {
            onSubmit().catch(console.error)
          }}
          icon="tabler:arrow-right"
          iconAtEnd
          loading={loading}
          disabled={summarizedText.trim() === ''}
        >
          {openType === 'update' ? 'Update' : 'Create'}
        </Button>
      </div>
    </>
  )
}

export default Review
