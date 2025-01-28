import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import React from 'react'
import useThemeColors from '@hooks/useThemeColor'
import { IMailInboxEntry } from '@interfaces/mail_inbox_interfaces'

function MailHeader({ mail }: { mail: IMailInboxEntry }): React.ReactElement {
  const { componentBgLighter } = useThemeColors()

  return (
    <div className="w-full">
      <div className="flex-between gap-8">
        <div className="flex items-center gap-2">
          <div
            className={`flex-center size-10 items-center rounded-full ${componentBgLighter} border border-bg-200 !bg-bg-50 dark:border-bg-700`}
          >
            <Icon icon="tabler:user" className="size-5 text-bg-500" />
          </div>
          <div>
            <p className="text-base font-medium">
              {mail.from.name || 'No name'}
            </p>
            <p className="text-xs text-custom-500">{mail.from.address}</p>
          </div>
        </div>
        <p className="text-sm text-bg-500">{moment(mail.date).fromNow()}</p>
      </div>
      <h1 className="mb-6 mt-4 text-2xl font-medium">{mail.subject}</h1>
    </div>
  )
}

export default MailHeader
