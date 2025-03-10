import { Icon } from '@iconify/react'
import clsx from 'clsx'
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
            className={clsx(
              'flex-center border-bg-200 bg-bg-50! dark:border-bg-700 size-10 items-center rounded-full border',
              componentBgLighter
            )}
          >
            <Icon className="text-bg-500 size-5" icon="tabler:user" />
          </div>
          <div>
            <p className="text-base font-medium">
              {mail.from.name || 'No name'}
            </p>
            <p className="text-custom-500 text-xs">{mail.from.address}</p>
          </div>
        </div>
        <p className="text-bg-500 text-sm">{moment(mail.date).fromNow()}</p>
      </div>
      <h1 className="mt-4 mb-6 text-2xl font-medium">{mail.subject}</h1>
    </div>
  )
}

export default MailHeader
