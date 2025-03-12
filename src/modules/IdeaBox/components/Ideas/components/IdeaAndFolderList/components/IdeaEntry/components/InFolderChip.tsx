import { Icon } from '@iconify/react'
import { Link, useParams } from 'react-router'

import { useIdeaBoxContext } from '@modules/IdeaBox/providers/IdeaBoxProvider'

import { IIdeaBoxEntry } from '../../../../../../../interfaces/ideabox_interfaces'

function InFolderChip({ entry }: { entry: IIdeaBoxEntry }) {
  const { setSearchQuery, setSelectedTags } = useIdeaBoxContext()
  const { '*': path } = useParams<{ '*': string }>()

  return typeof entry.folder !== 'string' ? (
    <span className="mt-3 flex items-center gap-2 text-sm">
      In
      <Link
        className="inline-flex items-center gap-2 rounded-full px-3 py-1 pl-2 hover:opacity-70"
        style={{
          color: entry.folder.color,
          backgroundColor: entry.folder.color + '30'
        }}
        to={
          entry.folder.id ===
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
        <Icon className="size-4" icon={entry.folder.icon} />
        {entry.folder.name}
      </Link>
    </span>
  ) : (
    <></>
  )
}

export default InFolderChip
