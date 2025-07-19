import { SidebarItem } from 'lifeforge-ui'
import { useCallback } from 'react'

function SidebarStarredItem({
  count,
  isActive,
  setActive,
  setOpen
}: {
  count: number
  isActive: boolean
  setActive: (active: boolean) => void
  setOpen: (open: boolean) => void
}) {
  const handleClick = useCallback(() => {
    setActive(true)
    setOpen(false)
  }, [])

  return (
    <SidebarItem
      active={isActive}
      icon="tabler:star-filled"
      name="Starred"
      namespace="apps.scoresLibrary"
      number={count}
      onClick={handleClick}
    />
  )
}

export default SidebarStarredItem
