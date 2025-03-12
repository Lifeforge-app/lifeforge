import { Icon } from '@iconify/react'
import clsx from 'clsx'
import moment from 'moment'
import React from 'react'

import { Button, Checkbox, HamburgerMenu, MenuItem } from '@lifeforge/ui'

import { type IMailInboxEntry } from '@modules/MailInbox/interfaces/mail_inbox_interfaces'

function EntryItem({
  mail,
  onView,
  onDelete,
  isSelected,
  hasSelected,
  onShiftSelect,
  onSelect
}: {
  mail: IMailInboxEntry
  onView: (mailId: string) => void
  onDelete: (mailId: string) => void
  isSelected: boolean
  hasSelected: boolean
  onShiftSelect: (mailId: string) => void
  onSelect: (mailId: string) => void
}): React.ReactElement {
  return (
    <div
      key={mail.id}
      className="flex-between border-bg-200 hover:bg-bg-200/50 dark:border-bg-800/50 dark:hover:bg-bg-800/50 flex w-full cursor-pointer gap-12 border-b p-4 text-left transition-all"
      role="button"
      tabIndex={0}
      onClick={e => {
        if (hasSelected) {
          if (e.shiftKey) {
            onShiftSelect(mail.id)
          } else {
            onSelect(mail.id)
          }
        } else {
          onView(mail.id)
        }
      }}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          onView(mail.id)
        }
      }}
    >
      <div className="flex w-full min-w-0 items-center gap-6">
        <Checkbox
          checked={isSelected}
          onChange={e => {
            if (e.shiftKey) {
              onShiftSelect(mail.id)
            } else {
              onSelect(mail.id)
            }
          }}
        />
        <div className="w-full min-w-0">
          <span className="text-bg-500 block text-sm">
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
            className={clsx(
              'flex w-full min-w-0 items-center gap-2 text-lg',
              mail.seen ? 'font-medium' : 'font-bold'
            )}
          >
            <span className="min-w-0 truncate">
              {mail.subject === '' ? 'No subject' : mail.subject}
            </span>
            {!mail.seen && (
              <span className="bg-custom-500/30 text-custom-500 rounded-full px-3 py-0.5 text-xs font-semibold">
                New
              </span>
            )}
          </div>

          <p className="text-bg-500 mt-1 truncate text-base font-light">
            {mail.text.trim() || 'No content'}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {mail.attachments?.length > 0 && (
          <Icon className="text-bg-500 size-4" icon="tabler:paperclip" />
        )}
        <span className="text-bg-500 mr-2 text-sm">
          {moment(mail.date).fromNow()}
        </span>
        <Button
          className="p-2!"
          icon="tabler:star"
          variant="no-bg"
          onClick={e => {
            e.stopPropagation()
          }}
        />
        <HamburgerMenu>
          <MenuItem
            icon="tabler:archive"
            text="Archive"
            onClick={e => {
              e.stopPropagation()
            }}
          />
          <MenuItem
            isRed
            icon="tabler:trash"
            text="Delete"
            onClick={e => {
              e.stopPropagation()
              onDelete(mail.id)
            }}
          />
        </HamburgerMenu>
      </div>
    </div>
  )
}

export default EntryItem
