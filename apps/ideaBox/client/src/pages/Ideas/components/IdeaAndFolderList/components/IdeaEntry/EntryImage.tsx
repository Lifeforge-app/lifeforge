import type { IdeaBoxIdea } from '@/providers/IdeaBoxProvider'
import forgeAPI from '@/utils/forgeAPI'
import Zoom from 'react-medium-image-zoom'

import CustomZoomContent from './components/CustomZoomContent'
import IdeaWrapper from './components/IdeaWrapper'

function EntryImage({ entry }: { entry: IdeaBoxIdea }) {
  if (entry.type !== 'image') {
    return null
  }

  return (
    <IdeaWrapper entry={entry}>
      <Zoom
        ZoomContent={CustomZoomContent}
        zoomImg={{
          src: forgeAPI.media.input({
            collectionId: entry.child.collectionId,
            recordId: entry.child.id,
            fieldId: entry.image
          }).endpoint
        }}
        zoomMargin={40}
      >
        <img
          alt={''}
          className="shadow-custom rounded-lg"
          src={
            forgeAPI.media.input({
              collectionId: entry.child.collectionId,
              recordId: entry.child.id,
              fieldId: entry.image
            }).endpoint
          }
        />
      </Zoom>
    </IdeaWrapper>
  )
}

export default EntryImage
