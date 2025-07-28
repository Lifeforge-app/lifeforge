import { Icon } from '@iconify/react'
import { Link, useParams } from 'react-router'

import {
  type IdeaBoxIdea,
  useIdeaBoxContext
} from '@apps/IdeaBox/providers/IdeaBoxProvider'

function InFolderChip({ entry }: { entry: IdeaBoxIdea }) {
  const { setSearchQuery, setSelectedTags } = useIdeaBoxContext()

  const { '*': path } = useParams<{ '*': string }>()

  if (!('fullPath' in entry) || !entry.expand || !entry.expand.folder) {
    return <></>
  }

  return (
    <span className="mt-3 flex items-center gap-2 text-sm">
      In
      <Link
        className="inline-flex items-center gap-2 rounded-full px-3 py-1 pl-2 hover:opacity-70"
        style={{
          color: entry.expand.folder.color,
          backgroundColor: entry.expand.folder.color + '30'
        }}
        to={
          entry.expand.folder.id ===
          path
            ?.split('/')
            .filter(e => e)
            .pop()
            ? ''
            : `.${entry.fullPath}`
        }
        onClick={() => {
          setSelectedTags([])
          setSearchQuery('')
        }}
      >
        <Icon className="size-4" icon={entry.expand.folder.icon} />
        {entry.expand.folder.name}
      </Link>
    </span>
  )
}

export default InFolderChip
