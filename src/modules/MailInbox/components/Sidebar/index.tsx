import React from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  SidebarDivider,
  SidebarItem,
  SidebarTitle,
  SidebarWrapper
} from '@components/layouts/sidebar'
import LabelList from './components/LabelList'
import { toDashCase } from '../../../../../tools/module-tools/utils/strings'

function Sidebar({
  isOpen,
  setOpen
}: {
  isOpen: boolean
  setOpen: (value: boolean) => void
}): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams()

  const sidebarItems = [
    { icon: 'tabler:inbox', name: 'Inbox' },
    { icon: 'tabler:star', name: 'Starred' },
    { icon: 'tabler:send', name: 'Sent' },
    { icon: 'tabler:file', name: 'Draft' },
    { icon: 'tabler:mail', name: 'All Mails' },
    { icon: 'tabler:trash', name: 'Trash' }
  ]

  return (
    <SidebarWrapper isOpen={isOpen} setOpen={setOpen}>
      {sidebarItems.map((item, index) => (
        <SidebarItem
          key={index}
          icon={item.icon}
          name={item.name}
          active={searchParams.get('label') === toDashCase(item.name)}
          onClick={() => {
            setSearchParams({ label: toDashCase(item.name) })
          }}
          number={87}
          onCancelButtonClick={
            item.name !== 'Inbox'
              ? () => {
                  const newParams = new URLSearchParams(searchParams)
                  newParams.delete('label')
                  setSearchParams(newParams)
                }
              : undefined
          }
        />
      ))}
      <SidebarDivider />
      <SidebarTitle
        name="Labels"
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {}}
      />
      <LabelList />
    </SidebarWrapper>
  )
}

export default Sidebar
