import { Icon } from '@iconify/react/dist/iconify.js'
import { ListResult } from 'pocketbase'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@components/buttons'
import { SearchInput } from '@components/inputs'
import ContentWrapperWithSidebar from '@components/layouts/module/ContentWrapperWithSidebar'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import SidebarAndContentWrapper from '@components/layouts/module/SidebarAndContentWrapper'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import Pagination from '@components/utilities/Pagination'
import Scrollbar from '@components/utilities/Scrollbar'
import useFetch from '@hooks/useFetch'
import { IMailInboxEntry } from '@interfaces/mail_inbox_interfaces'
import EntryItem from './components/EntryItem'
import Sidebar from './components/Sidebar'
import ViewMailModal from './components/ViewMailModal'

function MailInbox(): React.ReactElement {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [mails, , setMails] = useFetch<ListResult<IMailInboxEntry>>(
    `mail-inbox/entries?page=${page}`
  )
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMailFor, setViewMailFor] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!searchParams.has('label')) {
      setSearchParams({ label: 'inbox' })
    }
  }, [searchParams])

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
      <SidebarAndContentWrapper>
        <Sidebar
          isOpen={sidebarOpen}
          setOpen={setSidebarOpen}
          allMailsCount={typeof mails === 'string' ? 0 : mails.totalItems}
        />
        <ContentWrapperWithSidebar>
          <header className="flex-between flex w-full">
            <div className="flex min-w-0 items-end">
              <h1 className="truncate text-3xl font-semibold sm:text-4xl">
                {(() => {
                  switch (searchParams.get('label')) {
                    case 'inbox':
                      return t('sidebar.mailInbox.inbox')
                    case 'starred':
                      return t('sidebar.mailInbox.starred')
                    case 'sent':
                      return t('sidebar.mailInbox.sent')
                    case 'draft':
                      return t('sidebar.mailInbox.draft')
                    case 'trash':
                      return t('sidebar.mailInbox.trash')
                    case 'all-mails':
                      return t('sidebar.mailInbox.allMails')
                    default:
                      return t('sidebar.mailInbox.filtered')
                  }
                })()}
              </h1>
              <span className="ml-2 mr-8 text-base text-bg-500">(187)</span>
            </div>

            <button
              onClick={() => {
                setSidebarOpen(true)
              }}
              className="-ml-4 rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200 dark:hover:bg-bg-800 dark:hover:text-bg-50 lg:hidden"
            >
              <Icon icon="tabler:menu" className="text-2xl" />
            </button>
          </header>
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            stuffToSearch="mails"
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
        </ContentWrapperWithSidebar>
      </SidebarAndContentWrapper>
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
