import { Icon } from '@iconify/react'
import { Button } from 'lifeforge-ui'
import moment from 'moment'
import { useState } from 'react'
import Markdown from 'react-markdown'
import Zoom from 'react-medium-image-zoom'

import CustomZoomContent from '@apps/IdeaBox/pages/Ideas/components/IdeaAndFolderList/components/IdeaEntry/components/CustomZoomContent'

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
}) {
  const [viewRaw, setViewRaw] = useState(false)

  return (
    <>
      <div className="flex-between mt-4 mb-6 flex items-end!">
        <div className="flex flex-col gap-2">
          <span className="text-bg-500 text-lg font-medium">
            {moment(date).format('MMMM Do, YYYY')} - {mood.emoji} {mood.text}
          </span>
          <h2 className="text-4xl font-semibold">
            {title === '' ? 'Untitled' : title}
          </h2>
        </div>
      </div>
      <p className="text-bg-600 dark:text-bg-400 mb-6 text-lg tracking-wide">
        <span className="text-bg-800 dark:text-bg-100 text-5xl font-semibold uppercase">
          {summarizedText[0]}
        </span>
        {summarizedText.slice(1)}
      </p>
      <hr className="border-bg-200 dark:border-bg-800 mb-6" />
      <div className="prose max-w-full!">
        <Markdown>{cleanedUpText}</Markdown>
      </div>
      <Button
        className="mt-6 w-full"
        icon={viewRaw ? 'tabler:chevron-up' : 'tabler:chevron-down'}
        iconPosition="end"
        variant="plain"
        onClick={() => {
          setViewRaw(!viewRaw)
        }}
      >
        {viewRaw ? 'Hide' : 'Show'} Raw
      </Button>
      {viewRaw && (
        <p className="text-bg-500 mt-6 whitespace-pre-wrap">{rawText}</p>
      )}
      {photos.length > 0 && (
        <>
          <hr className="border-bg-200 dark:border-bg-800 my-6" />
          <h3 className="flex items-center gap-2 text-2xl font-semibold">
            <Icon className="size-6" icon="tabler:photo" />
            <span>
              Photos{' '}
              <span className="text-bg-500 text-sm">({photos.length})</span>
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
