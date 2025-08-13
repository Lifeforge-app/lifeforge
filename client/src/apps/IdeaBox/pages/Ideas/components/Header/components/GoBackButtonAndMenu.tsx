import { ContextMenu, ContextMenuItem, GoBackButton } from 'lifeforge-ui'
import { memo, useCallback } from 'react'
import { useNavigate } from 'react-router'

import { useIdeaBoxContext } from '@apps/IdeaBox/providers/IdeaBoxProvider'

function GoBackButtonAndMenu() {
  const navigate = useNavigate()

  const { viewArchived, setViewArchived, setSearchQuery, setSelectedTags } =
    useIdeaBoxContext()

  const handleGoBack = useCallback(() => {
    if (viewArchived) {
      setViewArchived(false)
    }
    setSearchQuery('')
    setSelectedTags([])
    navigate(location.pathname.split('/').slice(0, -1).join('/'))
  }, [viewArchived])

  const handleViewArchive = useCallback(() => {
    setViewArchived(prev => !prev)
    setSearchQuery('')
    setSelectedTags([])
  }, [])

  return (
    <div className="flex-between w-full">
      <GoBackButton onClick={handleGoBack} />
      <ContextMenu>
        <ContextMenuItem
          icon={viewArchived ? 'tabler:archive-off' : 'tabler:archive'}
          namespace="apps.ideaBox"
          text={viewArchived ? 'View Active' : 'View Archived'}
          onClick={handleViewArchive}
        />
      </ContextMenu>
    </div>
  )
}

export default memo(GoBackButtonAndMenu)
