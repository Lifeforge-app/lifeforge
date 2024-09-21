import moment from 'moment'
import React from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import { type IMailInboxEntry } from '@interfaces/mail_inbox_interfaces'

function EntryItem({ mail }: { mail: IMailInboxEntry }): React.ReactElement {
  console.log(mail)
  return (
    <li
      key={mail.id}
      className="flex-between group flex rounded-md bg-bg-50 p-4 shadow-custom transition-all hover:bg-bg-100/30"
    >
      <div>
        <span className="block text-sm text-bg-500">
          {mail.from.split(' ')[0].replace(/(^")|("$)/g, '') ?? 'No sender'}
        </span>
        <div className="text-lg font-medium">
          {mail.subject === '' ? 'No subject' : mail.subject}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-bg-500 group-hover:hidden">
          {moment(mail.date).fromNow() + (mail.seen ? ' (seen)' : '')}
        </span>
        <div className="hidden items-center gap-2 group-hover:flex">
          <Button isRed variant="no-bg" className="!p-2" icon="tabler:trash" />
        </div>
      </div>
    </li>
  )
}

export default EntryItem
