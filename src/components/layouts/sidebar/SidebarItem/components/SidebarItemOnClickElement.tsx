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
          onClick={() => {}}
          className="absolute left-0 top-0 size-full rounded-lg"
        />
      ) : (
        <Link
          onClick={() => {
            if (window.innerWidth < 1024) {
              toggleSidebar()
            }
            if (isMainSidebarItem) {
              setSubsectionExpanded(true)
            }
          }}
          to={''}
          className="absolute left-0 top-0 size-full rounded-lg"
        />
      )}
    </>
  )
}

export default SidebarItemOnClickElement
