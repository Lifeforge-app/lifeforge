/* eslint-disable @typescript-eslint/member-delimiter-style */
import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import React, { useState } from 'react'
import Markdown from 'react-markdown'
import Button from '@components/ButtonsAndInputs/Button'

function JournalView({
  date,
  title,
  mood,
  cleanedUpText,
  summarizedText,
  rawText,
  photos
}: {
  date: string
  title: string
  mood: { text: string; emoji: string }
  cleanedUpText: string
  summarizedText: string
  rawText: string
  photos: Array<{ preview: string }> | string[]
}): React.ReactElement {
  const [viewRaw, setViewRaw] = useState(false)
  return (
    <>
      <div className="flex-between my-6 flex !items-end">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-medium text-bg-500">
            {moment(date).format('MMMM Do, YYYY')} - {mood.emoji} {mood.text}
          </span>
          <h2 className="text-4xl font-semibold">
            {title === '' ? 'Untitled' : title}
          </h2>
        </div>
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
      {viewRaw && <p className="mt-6 text-bg-500">{rawText}</p>}
      {photos.length > 0 && (
        <>
          <hr className="my-6 border-bg-500" />
          <h3 className="flex items-center gap-2 text-2xl font-semibold">
            <Icon icon="tabler:photo" className="size-6" />
            <span>
              Photos{' '}
              <span className="text-sm text-bg-500">({photos.length})</span>
            </span>
          </h3>
          <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
            {photos.map(photo => (
              <img
                src={typeof photo === 'string' ? photo : photo.preview}
                alt=""
                key={typeof photo === 'string' ? photo : photo.preview}
                className="size-full rounded-lg object-contain"
              />
            ))}
          </div>
        </>
      )}
    </>
  )
}

export default JournalView
