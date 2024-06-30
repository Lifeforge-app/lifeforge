import React, { useEffect, useState } from 'react'
import DateInput from '@components/ButtonsAndInputs/DateInput'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import { type IJournalEntry } from '@interfaces/journal_interfaces'
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
  const [step, setStep] = useState<number>(1)
  const [date, setDate] = useState<string>(new Date().toISOString())
  const [rawText, setRawText] = useState<string>('')
  const [cleanedUpText, setCleanedUpText] = useState<string>('')
  const [summarizedText, setSummarizedText] = useState<string>('')
  const [photos, setPhotos] = useState<
    Array<{
      file: File
      preview: string
      caption: string
    }>
  >([])
  const [mood, setMood] = useState<{
    text: string
    emoji: string
  }>({
    text: '',
    emoji: ''
  })

  useEffect(() => {
    setStep(1)
    if (existedData !== null && openType === 'update') {
      setRawText(existedData.raw)
      setCleanedUpText(existedData.content)
    } else {
      setRawText('')
      setCleanedUpText('')
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
              <Photos setStep={setStep} photos={photos} setPhotos={setPhotos} />
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
                setStep={setStep}
                cleanedUpText={cleanedUpText}
                summarizedText={summarizedText}
                photos={photos}
                mood={mood}
                rawText={rawText}
              />
            )
        }
      })()}
    </Modal>
  )
}

export default ModifyJournalEntryModal
