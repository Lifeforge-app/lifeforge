import React from 'react'
import {
  SidebarDivider,
  SidebarItem,
  SidebarTitle,
  SidebarWrapper
} from '@components/layouts/sidebar'

function Sidebar({
  isOpen,
  setOpen
}: {
  isOpen: boolean
  setOpen: (value: boolean) => void
}): React.ReactElement {
  return (
    <SidebarWrapper>
      <SidebarItem icon="tabler:inbox" name="Inbox" />
      <SidebarItem icon="tabler:star" name="Starred" />
      <SidebarItem icon="tabler:send" name="Sent" />
      <SidebarItem icon="tabler:file" name="Draft" />
      <SidebarItem icon="tabler:mail" name="All Mails" />
      <SidebarItem icon="tabler:trash" name="Trash" />
      <SidebarDivider />
      <SidebarTitle name="Labels" actionButtonIcon="tabler:plus" />
    </SidebarWrapper>
  )
}

export default Sidebar
