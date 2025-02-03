import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import React from 'react'
import { Button, Checkbox } from '@components/buttons'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import { type IMailInboxEntry } from '@interfaces/mail_inbox_interfaces'

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
      className="flex-between cursor-pointer flex w-full gap-12 border-b border-bg-200 p-4 text-left transition-all hover:bg-bg-200/50 dark:border-bg-800/50 dark:hover:bg-bg-800/50"
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
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {mail.attachments?.length > 0 && (
          <Icon className="size-4 text-bg-500" icon="tabler:paperclip" />
        )}
        <span className="mr-2 text-sm text-bg-500">
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
