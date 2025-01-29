import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import React from 'react'
import { Button } from '@components/buttons'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import { type IMailInboxEntry } from '@interfaces/mail_inbox_interfaces'

function EntryItem({
  mail,
  onView
}: {
  mail: IMailInboxEntry
  onView: (mailId: string) => void
}): React.ReactElement {
  return (
    <div
      key={mail.id}
      role="button"
      tabIndex={0}
      onClick={() => onView(mail.id)}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          onView(mail.id)
        }
      }}
      className="flex-between cursor-pointer flex w-full gap-12 border-b border-bg-200 p-4 text-left transition-all hover:bg-bg-200/50 dark:border-bg-800/50 dark:hover:bg-bg-800/50"
    >
      <div className="w-full min-w-0">
        <span className="block text-sm text-bg-500">
          {(() => {
            if (mail.from.name) {
              return mail.from.name
            }

            if (mail.from.address) {
              return mail.from.address
            }

            return 'No sender'
          })()}
        </span>
        <div
          className={`flex w-full min-w-0 items-center gap-2 text-lg ${
            mail.seen ? 'font-medium' : 'font-bold'
          }`}
        >
          <span className="min-w-0 truncate">
            {mail.subject === '' ? 'No subject' : mail.subject}
          </span>
          {!mail.seen && (
            <>
              <span className="rounded-full bg-custom-500/30 px-3 py-0.5 text-xs font-semibold text-custom-500">
                New
              </span>
            </>
          )}
        </div>

        <p className="mt-1 truncate text-base font-light text-bg-500">
          {mail.text.trim() || 'No content'}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {mail.attachments?.length > 0 && (
          <Icon icon="tabler:paperclip" className="size-4 text-bg-500" />
        )}
        <span className="mr-2 text-sm text-bg-500">
          {moment(mail.date).fromNow()}
        </span>
        <Button
          variant="no-bg"
          icon="tabler:star"
          onClick={e => {
            e.stopPropagation()
          }}
          className="p-2!"
        />
        <HamburgerMenu>
          <MenuItem
            icon="tabler:archive"
            onClick={e => {
              e.stopPropagation()
            }}
            text="Archive"
          />
        </HamburgerMenu>
      </div>
    </div>
  )
}

export default EntryItem
