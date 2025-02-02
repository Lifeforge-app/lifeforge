import React from 'react'
import { Link } from 'react-router-dom'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'

function SidebarItemOnClickElement({
  onClick,
  setSubsectionExpanded,
  isMainSidebarItem
}: {
  onClick?: () => void
  setSubsectionExpanded: (value: boolean) => void
  isMainSidebarItem: boolean
  prefix: string
  name: string
}): React.ReactElement {
  const { toggleSidebar } = isMainSidebarItem
    ? useGlobalStateContext()
    : { toggleSidebar: () => {} }

  return (
    <>
      {onClick !== undefined ? (
        <button
          className="absolute left-0 top-0 size-full rounded-lg"
          onClick={() => {}}
        />
      ) : (
        <Link
          className="absolute left-0 top-0 size-full rounded-lg"
          to={''}
          onClick={() => {
            if (window.innerWidth < 1024) {
              toggleSidebar()
            }
            if (isMainSidebarItem) {
              setSubsectionExpanded(true)
            }
          }}
        />
      )}
    </>
  )
}

export default SidebarItemOnClickElement
