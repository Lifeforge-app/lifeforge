import React from 'react'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'

function MailInbox(): React.ReactElement {
  const [mails] = useFetch<any>('mail-inbox/list')

  return (
    <ModuleWrapper>
      <ModuleHeader icon="tabler:mail" title="Mail Inbox" desc="..." />
      <APIComponentWithFallback data={mails}>
        {mails => (
          <ul className="mt-4 divide-y-2 divide-bg-200 dark:divide-bg-900">
            {mails.map((mail: any) => (
              <li key={mail.id} className="space-y-1 p-4">
                <span className="block text-sm text-bg-500">
                  {mail.from.split(' ')[0].replace(/(^")|("$)/g, '') ??
                    'No sender'}
                </span>
                {mail.subject === '' ? 'No subject' : mail.subject}
              </li>
            ))}
          </ul>
        )}
      </APIComponentWithFallback>
    </ModuleWrapper>
  )
}

export default MailInbox
