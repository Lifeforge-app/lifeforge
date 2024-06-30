import React, { useState } from 'react'
import Markdown from 'react-markdown'
import Button from '@components/ButtonsAndInputs/Button'

function Review({
  setStep,
  rawText,
  cleanedUpText,
  summarizedText,
  photos,
  mood
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>
  rawText: string
  cleanedUpText: string
  summarizedText: string
  photos: Array<{
    file: File
    preview: string
    caption: string
  }>
  mood: {
    text: string
    emoji: string
  }
}): React.ReactElement {
  const [viewRaw, setViewRaw] = useState(false)
  return (
    <>
      <div className="flex-between my-6 flex">
        <h2 className="text-4xl font-semibold">Diary Review</h2>
        <span className="block rounded-full bg-bg-700/50 px-3 py-1 text-base font-medium">
          {mood.emoji} {mood.text}
        </span>
      </div>
      <p className="mb-6 text-lg">
        <span className="text-5xl font-semibold uppercase">
          {summarizedText[0]}
        </span>
        {summarizedText.slice(1)}
      </p>
      <hr className="mb-6 border-bg-500" />
      <Markdown className="prose !max-w-full">{cleanedUpText}</Markdown>
      <Button
        icon={viewRaw ? 'tabler:chevron-up' : 'tabler:chevron-down'}
        className="mt-6"
        iconAtEnd
        variant="no-bg"
        onClick={() => {
          setViewRaw(!viewRaw)
        }}
      >
        {viewRaw ? 'Hide' : 'Show'} Raw
      </Button>
      {viewRaw && <p className="mt-6 text-lg text-bg-500">{rawText}</p>}
    </>
  )
}

export default Review
