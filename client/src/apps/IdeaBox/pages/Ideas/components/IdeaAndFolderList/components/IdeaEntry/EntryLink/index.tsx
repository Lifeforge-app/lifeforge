import type { IdeaBoxIdea } from '@apps/IdeaBox/providers/IdeaBoxProvider'

import IdeaWrapper from '../components/IdeaWrapper'
import EntryContent from './components/EntryContent'

function EntryLink({ entry }: { entry: IdeaBoxIdea }) {
  if (entry.type !== 'link') {
    return null
  }

  return (
    <IdeaWrapper entry={entry}>
      <EntryContent key={entry.link} entry={entry} />
    </IdeaWrapper>
  )
}

export default EntryLink
