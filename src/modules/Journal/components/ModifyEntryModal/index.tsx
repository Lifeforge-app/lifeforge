import { cookieParse } from 'pocketbase'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import DateInput from '@components/ButtonsAndInputs/DateInput'
import Input from '@components/ButtonsAndInputs/Input'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import { type IJournalEntry } from '@interfaces/journal_interfaces'
import { encrypt } from '@utils/encryption'
import APIRequest from '@utils/fetchData'
import Cleanup from './sections/Cleanup'
import Mood from './sections/Mood'
import Photos from './sections/Photos'
import RawText from './sections/RawText'
import Review from './sections/Review'
import Summarize from './sections/Summarize'

function ModifyJournalEntryModal({
  openType,
  onClose,
  existedData,
  masterPassword
}: {
  openType: 'create' | 'update' | null
  onClose: () => void
  existedData: IJournalEntry | null
  masterPassword: string
}): React.ReactElement {
  const { t } = useTranslation()
  const [step, setStep] = useState<number>(1)
  const [date, setDate] = useState<string>(new Date().toISOString())
  const [title, setTitle] = useState<string>('')
  const [rawText, setRawText] = useState<string>('')
  const [cleanedUpText, setCleanedUpText] = useState<string>('')
  const [summarizedText, setSummarizedText] = useState<string>('')
  const [photos, setPhotos] = useState<
    Array<{
      file: File
      preview: string
    }>
  >([])
  const [mood, setMood] = useState<{
    text: string
    emoji: string
  }>({
    text: '',
    emoji: ''
  })
  const [titleGenerationLoading, setTitleGenerationLoading] =
    useState<boolean>(false)

  async function generateTitle(): Promise<void> {
    setTitle('')

    if (cleanedUpText === '') {
      toast.error('Please complete step 2 first')
      return
    }

    setTitleGenerationLoading(true)

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
        setTitleGenerationLoading(false)

        throw new Error(t('journal.failedToUnlock'))
      }
    })

    await APIRequest({
      endpoint: '/journal/entries/ai/title',
      method: 'POST',
      body: {
        text: encrypt(cleanedUpText, masterPassword),
        master: encrypt(masterPassword, challenge)
      },
      successInfo: 'generate',
      failureInfo: 'generate',
      callback: data => {
        setTitle(data.data)
      },
      finalCallback: () => {
        setTitleGenerationLoading(false)
      }
    })
  }

  useEffect(() => {
    setStep(1)
    if (existedData !== null && openType === 'update') {
      setTimeout(() => {
        setTitle(existedData.title)
        setRawText(existedData.raw)
        setCleanedUpText(existedData.content)
        setSummarizedText(existedData.summary)
        setDate(existedData.date)
        setMood(existedData.mood)
      }, 500)
    } else {
      setTitle('')
      setRawText('')
      setCleanedUpText('')
      setSummarizedText('')
      setDate(new Date().toISOString())
      setPhotos([])
      setMood({
        text: '',
        emoji: ''
      })
    }
  }, [existedData, openType])

  return (
    <Modal isOpen={openType !== null} className="h-max md:!min-w-[40vw]">
      <ModalHeader
        icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
        title={
          openType === 'create'
            ? 'Create Journal Entry'
            : 'Update Journal Entry'
        }
        onClose={onClose}
      />
      <DateInput
        date={date}
        setDate={setDate}
        icon="tabler:calendar"
        name="Date"
        hasMargin={false}
      />
      <Input
        name="Journal Title"
        value={title}
        updateValue={e => {
          setTitle(e.target.value)
        }}
        darker
        icon="tabler:file-text"
        additionalClassName="mt-4"
        placeholder="A Beautiful Day"
        actionButtonIcon={
          titleGenerationLoading ? 'svg-spinners:180-ring' : 'mage:stars-c'
        }
        onActionButtonClick={() => {
          generateTitle().catch(console.error)
        }}
      />
      <ul className="steps mt-8 shrink-0">
        {['Raw Text', 'Cleanup', 'Summarize', 'Photos', 'Mood', 'Review'].map(
          (stepName, index) => (
            <li
              key={index}
              className={`step ${
                step >= index + 1
                  ? 'step-primary text-bg-100 before:bg-custom-500 after:!bg-custom-500 after:text-bg-900'
                  : 'text-bg-500 before:bg-bg-800 after:bg-bg-800'
              } before:font-medium`}
            >
              {stepName}
            </li>
          )
        )}
      </ul>
      <p className="mt-6 text-bg-500">
        {(() => {
          switch (step) {
            case 1:
              return 'Paste the text that you wrote using voice recognition or manually. It will be cleaned up and summarized in the next steps. No worry about spelling or grammar!'
            case 2:
              return 'The AI will cleanup the text, like adding punctuation and fixing spelling errors. There might be some mistakes, but you can review the text and make necessary changes in the text box below.'
            case 3:
              return 'The AI generate a short summary of the text that will be displayed in the diary list. You can review and edit the summary in the text box below.'
            case 4:
              return 'You can attach up to 10 photos of your memorable moments in the diary entry. They will be displayed along with the text. Captions can be added to each photo.'
            case 5:
              return 'AI will analyze the text and generate a mood for the diary entry. Of course, that is just a prediction and you can change it if you want.'
            case 6:
              return 'Review the entry before saving. If you are satisfied with the entry, click the save button to save it to the diary, otherwise you can go back and make changes.'
          }
        })()}
      </p>
      {(() => {
        switch (step) {
          case 1:
            return (
              <RawText
                openType={openType}
                setStep={setStep}
                rawText={rawText}
                setRawText={setRawText}
              />
            )
          case 2:
            return (
              <Cleanup
                setStep={setStep}
                rawText={rawText}
                cleanedUpText={cleanedUpText}
                setCleanedUpText={setCleanedUpText}
                masterPassword={masterPassword}
              />
            )
          case 3:
            return (
              <Summarize
                setStep={setStep}
                cleanedUpText={cleanedUpText}
                summarizedText={summarizedText}
                setSummarizedText={setSummarizedText}
                masterPassword={masterPassword}
              />
            )
          case 4:
            return (
              <Photos
                setStep={setStep}
                photos={photos}
                setPhotos={setPhotos}
                openType={openType}
              />
            )
          case 5:
            return (
              <Mood
                setStep={setStep}
                cleanedUpText={cleanedUpText}
                mood={mood}
                setMood={setMood}
                masterPassword={masterPassword}
              />
            )
          case 6:
            return (
              <Review
                id={existedData?.id ?? ''}
                date={date}
                title={title}
                setStep={setStep}
                cleanedUpText={cleanedUpText}
                summarizedText={summarizedText}
                photos={photos}
                mood={mood}
                rawText={rawText}
                masterPassword={masterPassword}
                onClose={onClose}
                openType={openType}
              />
            )
        }
      })()}
    </Modal>
  )
}

export default ModifyJournalEntryModal
