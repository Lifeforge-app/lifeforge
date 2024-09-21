import React from 'react'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import EntryItem from './components/EntryItem'

function MailInbox(): React.ReactElement {
  const [mails] = useFetch<any>('mail-inbox/list')

  return (
    <ModuleWrapper>
      <ModuleHeader icon="tabler:mail" title="Mail Inbox" />
      <APIComponentWithFallback data={mails}>
        {mails => (
          <ul className="mt-4 space-y-2">
            {mails.map((mail: any) => (
              <EntryItem key={mail.id} mail={mail} />
            ))}
          </ul>
        )}
      </APIComponentWithFallback>
    </ModuleWrapper>
  )
}

export default MailInbox
