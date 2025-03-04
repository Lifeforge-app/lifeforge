import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { DateInput, TextInput } from '@components/inputs'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import { type IJournalEntry } from '@interfaces/journal_interfaces'
import { encrypt } from '@utils/encryption'
import fetchAPI from '@utils/fetchAPI'
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
  const { t } = useTranslation('modules.journal')
  const [step, setStep] = useState<number>(1)
  const [date, setDate] = useState<string>(new Date().toISOString())
  const [title, setTitle] = useState<string>('')
  const [rawText, setRawText] = useState<string>('')
  const [cleanedUpText, setCleanedUpText] = useState<string>('')
  const [summarizedText, setSummarizedText] = useState<string>('')
  const [photos, setPhotos] = useState<
    | Array<{
        file: File
        preview: string
      }>
    | string[]
  >([])
  const [originalPhotosLength, setOriginalPhotosLength] = useState<number>(0)
  const [mood, setMood] = useState<{
    text: string
    emoji: string
  }>({
    text: '',
    emoji: ''
  })
  const [titleGenerationLoading, setTitleGenerationLoading] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  async function generateTitle(): Promise<void> {
    setTitle('')

    if (cleanedUpText === '') {
      toast.error('Please complete step 2 first')
      return
    }

    setTitleGenerationLoading(true)

    try {
      const challenge = await fetchAPI<string>(`journal/auth/challenge`)

      const data = await fetchAPI<string>('journal/entries/ai/title', {
        method: 'POST',
        body: {
          text: encrypt(cleanedUpText, masterPassword),
          master: encrypt(masterPassword, challenge)
        }
      })

      setTitle(data)
    } catch {
      toast.error(t('fetch.fetchError'))
    } finally {
      setTitleGenerationLoading(false)
    }
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
        setPhotos(existedData.photos)
        setMood(existedData.mood)
        setOriginalPhotosLength(existedData.photos.length)
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
      setOriginalPhotosLength(0)
    }
  }, [existedData, openType])

  return (
    <ModalWrapper
      className="h-max md:min-w-[40vw]!"
      isOpen={openType !== null}
      modalRef={ref}
    >
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
        darker
        date={date}
        hasMargin={false}
        icon="tabler:calendar"
        modalRef={ref}
        name="Date"
        namespace="modules.journal"
        setDate={setDate}
      />
      <TextInput
        darker
        actionButtonIcon={
          titleGenerationLoading ? 'svg-spinners:180-ring' : 'mage:stars-c'
        }
        className="mt-4"
        icon="tabler:file-text"
        name="Journal Title"
        namespace="modules.journal"
        placeholder="A Beautiful Day"
        setValue={setTitle}
        value={title}
        onActionButtonClick={() => {
          generateTitle().catch(console.error)
        }}
      />
      <ul className="steps mt-6 shrink-0">
        {['Raw Text', 'Cleanup', 'Summarize', 'Photos', 'Mood', 'Review'].map(
          (stepName, index) => (
            <li
              key={index}
              className={clsx(
                'step before:font-medium',
                step >= index + 1
                  ? 'step-primary before:bg-custom-500 after:bg-custom-500! after:text-bg-50 dark:after:text-bg-800'
                  : 'text-bg-500 before:bg-bg-200 after:bg-bg-200 dark:before:bg-bg-800 dark:after:bg-bg-800'
              )}
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
                rawText={rawText}
                setRawText={setRawText}
                setStep={setStep}
              />
            )
          case 2:
            return (
              <Cleanup
                cleanedUpText={cleanedUpText}
                masterPassword={masterPassword}
                rawText={rawText}
                setCleanedUpText={setCleanedUpText}
                setStep={setStep}
              />
            )
          case 3:
            return (
              <Summarize
                cleanedUpText={cleanedUpText}
                masterPassword={masterPassword}
                setStep={setStep}
                setSummarizedText={setSummarizedText}
                summarizedText={summarizedText}
              />
            )
          case 4:
            return (
              <Photos
                openType={openType}
                originalPhotosLength={originalPhotosLength}
                photos={
                  photos as Array<{
                    file: File
                    preview: string
                  }>
                }
                setPhotos={
                  setPhotos as React.Dispatch<
                    React.SetStateAction<
                      Array<{
                        file: File
                        preview: string
                      }>
                    >
                  >
                }
                setStep={setStep}
              />
            )
          case 5:
            return (
              <Mood
                cleanedUpText={cleanedUpText}
                masterPassword={masterPassword}
                mood={mood}
                setMood={setMood}
                setStep={setStep}
              />
            )
          case 6:
            return (
              <Review
                cleanedUpText={cleanedUpText}
                date={date}
                id={existedData?.id ?? ''}
                masterPassword={masterPassword}
                mood={mood}
                openType={openType}
                photos={photos.every(p => typeof p === 'string') ? [] : photos}
                rawText={rawText}
                setStep={setStep}
                summarizedText={summarizedText}
                title={title}
                onClose={onClose}
              />
            )
        }
      })()}
    </ModalWrapper>
  )
}

export default ModifyJournalEntryModal
