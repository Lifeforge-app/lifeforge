import { Icon } from '@iconify/react'
import moment from 'moment'
import React, { useState } from 'react'
import Markdown from 'react-markdown'
import Zoom from 'react-medium-image-zoom'
import { Button } from '@components/buttons'
import CustomZoomContent from '../../IdeaBox/components/Ideas/components/IdeaAndFolderList/components/IdeaEntry/components/CustomZoomContent'

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
      <div className="flex-between mb-6 mt-4 flex items-end!">
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
      <Markdown className="prose max-w-full!">{cleanedUpText}</Markdown>

      <Button
        iconAtEnd
        className="mt-6"
        icon={viewRaw ? 'tabler:chevron-up' : 'tabler:chevron-down'}
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
            <Icon className="size-6" icon="tabler:photo" />
            <span>
              Photos{' '}
              <span className="text-sm text-bg-500">({photos.length})</span>
            </span>
          </h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {photos.map(photo => (
              <div
                key={typeof photo === 'string' ? photo : photo.preview}
                className="relative max-h-[300px] min-h-32 grow overflow-hidden rounded-lg"
              >
                <Zoom
                  ZoomContent={CustomZoomContent}
                  zoomImg={{
                    src: typeof photo === 'string' ? photo : photo.preview
                  }}
                  zoomMargin={40}
                >
                  <img
                    alt={''}
                    className="size-full max-h-[300px] min-h-32 object-cover"
                    src={
                      typeof photo === 'string'
                        ? photo + '&thumb=0x300'
                        : photo.preview
                    }
                  />
                </Zoom>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}

export default JournalView
