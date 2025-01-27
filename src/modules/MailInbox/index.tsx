// eslint-disable-next-line import/named
import { ListResult } from 'pocketbase'
import React, { useState } from 'react'
import { Button } from '@components/buttons'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import Pagination from '@components/utilities/Pagination'
import Scrollbar from '@components/utilities/Scrollbar'
import useFetch from '@hooks/useFetch'
import { IMailInboxEntry } from '@interfaces/mail_inbox_interfaces'
import EntryItem from './components/EntryItem'
import ViewMailModal from './components/ViewMailModal'

function MailInbox(): React.ReactElement {
  const [page, setPage] = useState(1)
  const [mails, , setMails] = useFetch<ListResult<IMailInboxEntry>>(
    `mail-inbox?page=${page}`
  )
  const [viewMailFor, setViewMailFor] = useState<string | null>(null)

  return (
    <ModuleWrapper>
      <ModuleHeader
        icon="tabler:mail"
        title="Mail Inbox"
        actionButton={
          <Button
            icon="tabler:pencil"
            onClick={() => {
              console.log('Compose mail')
            }}
          >
            Compose
          </Button>
        }
      />
      <div className="mt-6 flex-1">
        <APIFallbackComponent data={mails}>
          {mails => (
            <Scrollbar>
              <Pagination
                totalPages={mails.totalPages}
                currentPage={page}
                onPageChange={setPage}
              />
              <div className="my-4">
                {mails.items.map((mail: IMailInboxEntry) => (
                  <EntryItem
                    key={mail.id}
                    mail={mail}
                    onView={mail => {
                      setViewMailFor(mail)
                    }}
                  />
                ))}
              </div>
              <Pagination
                totalPages={mails.totalPages}
                currentPage={page}
                onPageChange={setPage}
                className="mb-6"
              />
            </Scrollbar>
          )}
        </APIFallbackComponent>
      </div>
      <ViewMailModal
        openFor={viewMailFor}
        onClose={() => setViewMailFor(null)}
        onSeen={() => {
          setMails(mails => {
            if (typeof mails === 'string') {
              return mails
            }

            return {
              ...mails,
              items: mails.items.map(mail => {
                if (mail.id === viewMailFor) {
                  return {
                    ...mail,
                    seen: true
                  }
                }

                return mail
              })
            }
          })
        }}
      />
    </ModuleWrapper>
  )
}

export default MailInbox
