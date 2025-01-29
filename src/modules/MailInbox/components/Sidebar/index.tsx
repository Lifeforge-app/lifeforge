import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  SidebarDivider,
  SidebarItem,
  SidebarTitle,
  SidebarWrapper
} from '@components/layouts/sidebar'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import { IMailInboxLabel } from '@interfaces/mail_inbox_interfaces'
import LabelList from './components/LabelList'
import { toDashCase } from '../../../../../tools/module-tools/utils/strings'

function Sidebar({
  isOpen,
  setOpen,
  allMailsCount
}: {
  isOpen: boolean
  setOpen: (value: boolean) => void
  allMailsCount: number
}): React.ReactElement {
  const [labels] = useFetch<IMailInboxLabel[]>('mail-inbox/labels')
  const [searchParams, setSearchParams] = useSearchParams()

  const sidebarItems = useMemo(() => {
    if (typeof labels === 'string') return labels
    return [
      {
        icon: 'tabler:inbox',
        name: 'Inbox',
        count: labels.find(l => l.name === 'INBOX')?.count
      },
      {
        icon: 'tabler:star',
        name: 'Starred',
        count: labels.find(l => l.name === 'Starred')?.count
      },
      {
        icon: 'tabler:send',
        name: 'Sent',
        count: labels.find(l => l.name === 'Sent')?.count
      },
      { icon: 'tabler:file', name: 'Draft', count: 0 },
      { icon: 'tabler:mail', name: 'All Mails', count: allMailsCount },
      {
        icon: 'tabler:trash',
        name: 'Trash',
        count: labels.find(l => l.name === 'Trash')?.count
      }
    ]
  }, [labels, allMailsCount])

  return (
    <SidebarWrapper isOpen={isOpen} setOpen={setOpen}>
      <APIFallbackComponent data={sidebarItems}>
        {sidebarItems => (
          <>
            {sidebarItems.map((item, index) => (
              <SidebarItem
                key={index}
                icon={item.icon}
                name={item.name}
                active={searchParams.get('label') === toDashCase(item.name)}
                onClick={() => {
                  setSearchParams({ label: toDashCase(item.name) })
                }}
                number={item.count}
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
            <LabelList labels={labels} />
          </>
        )}
      </APIFallbackComponent>
    </SidebarWrapper>
  )
}

export default Sidebar
