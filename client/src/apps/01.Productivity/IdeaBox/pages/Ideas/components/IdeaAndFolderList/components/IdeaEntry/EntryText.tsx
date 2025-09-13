import { useState } from 'react'
import Markdown from 'react-markdown'

import type { IdeaBoxIdea } from '@apps/01.Productivity/ideaBox/providers/IdeaBoxProvider'

import IdeaWrapper from './components/IdeaWrapper'

function EntryText({ entry }: { entry: IdeaBoxIdea }) {
  const [expanded, setExpanded] = useState(false)

  if (entry.type !== 'text') {
    return null
  }

  return (
    <IdeaWrapper
      entry={entry}
      onClick={() => {
        setExpanded(prev => !prev)
      }}
    >
      {!expanded ? (
        <p className="line-clamp-6 w-full min-w-0 overflow-hidden break-all whitespace-pre-wrap !select-text">
          {entry.content}
        </p>
      ) : (
        <div className="prose flex flex-col break-all whitespace-pre-wrap">
          <Markdown>{entry.content}</Markdown>
        </div>
      )}
    </IdeaWrapper>
  )
}

export default EntryText
