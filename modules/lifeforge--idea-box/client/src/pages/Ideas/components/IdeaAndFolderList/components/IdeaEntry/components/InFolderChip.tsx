import { useNavigate, useParams } from 'react-router'

import { TagChip } from '@lifeforge/ui'

import {
  type IdeaBoxIdea,
  useIdeaBoxContext
} from '@/providers/IdeaBoxProvider'

function InFolderChip({ entry }: { entry: IdeaBoxIdea }) {
  const { setSearchQuery, setSelectedTags } = useIdeaBoxContext()
  const navigate = useNavigate()
  const { '*': path } = useParams<{ '*': string }>()

  if (!('fullPath' in entry) || !entry.expand || !entry.expand.folder) {
    return <></>
  }

  return (
    <span className="mt-3 flex items-center gap-2 text-sm">
      In
      <TagChip
        color={entry.expand.folder.color}
        icon={entry.expand.folder.icon}
        label={entry.expand.folder.name}
        onClick={e => {
          e.preventDefault()
          navigate(
            entry.expand.folder?.id ===
              path
                ?.split('/')
                .filter(e => e)
                .pop()
              ? ''
              : `.${entry.fullPath}`
          )
          setSelectedTags([])
          setSearchQuery('')
        }}
      />
    </span>
  )
}

export default InFolderChip
