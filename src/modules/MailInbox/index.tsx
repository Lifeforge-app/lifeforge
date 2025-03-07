/* eslint-disable sonarjs/no-nested-conditional */
import { Icon } from '@iconify/react'
import { ListResult } from 'pocketbase'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { Button } from '@components/buttons'
import { SearchInput } from '@components/inputs'
import ContentWrapperWithSidebar from '@components/layouts/module/ContentWrapperWithSidebar'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import SidebarAndContentWrapper from '@components/layouts/module/SidebarAndContentWrapper'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import Pagination from '@components/utilities/Pagination'
import Scrollbar from '@components/utilities/Scrollbar'
import useFetch from '@hooks/useFetch'
import {
  IMailInboxEntry,
  IMailInboxLabel
} from '@interfaces/mail_inbox_interfaces'
import EntryItem from './components/EntryItem'
import Sidebar from './components/Sidebar'
import ViewMailModal from './components/ViewMailModal'

function MailInbox(): React.ReactElement {
  const [searchParams] = useSearchParams()
  const { t } = useTranslation('modules.mailInbox')
  const [page, setPage] = useState(1)
  const [mails, refreshMails, setMails] = useFetch<ListResult<IMailInboxEntry>>(
    `mail-inbox/entries?page=${page}&label=${searchParams.get('label')}`
  )
  const [labels, refreshLabels] =
    useFetch<IMailInboxLabel[]>('mail-inbox/labels')
  const [viewMailFor, setViewMailFor] = useState<string | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState(false)
  const [emptyTrashConfirmationModalOpen, setEmptyTrashConfirmationModalOpen] =
    useState(false)
  const [lastSelected, setLastSelected] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <ModuleWrapper>
      <ModuleHeader
        actionButton={
          searchParams.get('label') === 'trash' ? (
            <Button
              isRed
              icon="tabler:trash"
              namespace="modules.mailInbox"
              onClick={() => {
                if (selected.length) {
                  setDeleteConfirmationModalOpen(true)
                } else {
                  setEmptyTrashConfirmationModalOpen(true)
                }
              }}
            >
              {selected.length ? 'Delete Permanently' : 'Empty Trash'}
            </Button>
          ) : selected.length ? (
            <Button
              isRed
              icon="tabler:trash"
              namespace="modules.mailInbox"
              onClick={() => {
                setDeleteConfirmationModalOpen(true)
              }}
            >
              Delete
            </Button>
          ) : (
            <Button
              icon="tabler:pencil"
              namespace="modules.mailInbox"
              onClick={() => {
                console.log('Compose mail')
              }}
            >
              Compose
            </Button>
          )
        }
        icon="tabler:mail"
        title="Mail Inbox"
      />
      <SidebarAndContentWrapper>
        <Sidebar
          allMailsCount={typeof mails === 'string' ? 0 : mails.totalItems}
          isOpen={sidebarOpen}
          labels={labels}
          setOpen={setSidebarOpen}
        />
        <ContentWrapperWithSidebar>
          <header className="flex-between flex w-full">
            <div className="flex min-w-0 items-end">
              <h1 className="truncate text-3xl font-semibold sm:text-4xl">
                {(() => {
                  switch (searchParams.get('label')) {
                    case 'inbox':
                      return t('headers.inbox')
                    case 'starred':
                      return t('headers.starred')
                    case 'sent':
                      return t('headers.sent')
                    case 'draft':
                      return t('headers.draft')
                    case 'trash':
                      return t('headers.trash')
                    case 'all-mails':
                      return t('headers.allMails')
                    default:
                      return t('headers.filteredMails')
                  }
                })()}
              </h1>
              <span className="ml-2 mr-8 text-base text-bg-500">
                (
                {(() => {
                  if (typeof mails === 'string') {
                    return '0'
                  }

                  return mails.totalItems
                })()}
                )
              </span>
            </div>

            <button
              className="-ml-4 rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200 dark:hover:bg-bg-800 dark:hover:text-bg-50 lg:hidden"
              onClick={() => {
                setSidebarOpen(true)
              }}
            >
              <Icon className="text-2xl" icon="tabler:menu" />
            </button>
          </header>
          <SearchInput
            namespace="modules.mailInbox"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            stuffToSearch="mail"
          />
          <div className="mt-6 flex-1">
            <APIFallbackComponent data={mails}>
              {mails => (
                <Scrollbar>
                  <Pagination
                    currentPage={page}
                    totalPages={mails.totalPages}
                    onPageChange={setPage}
                  />
                  <div className="my-4 flex-1">
                    {mails.totalItems ? (
                      mails.items.map((mail: IMailInboxEntry) => (
                        <EntryItem
                          key={mail.id}
                          hasSelected={selected.length > 0}
                          isSelected={selected.includes(mail.id)}
                          mail={mail}
                          onDelete={mail => {
                            setSelected([mail])
                            setDeleteConfirmationModalOpen(true)
                          }}
                          onSelect={mail => {
                            setSelected(selected =>
                              selected.includes(mail)
                                ? selected.filter(id => id !== mail)
                                : [...selected, mail]
                            )
                            setLastSelected(mail)
                          }}
                          onShiftSelect={mail => {
                            if (selected.length === 0) {
                              setSelected([mail])
                              return
                            }

                            const allMails = mails.items

                            const startIndex = allMails.findIndex(
                              m => m.id === lastSelected
                            )

                            const endIndex = allMails.findIndex(
                              m => m.id === mail
                            )

                            const toBeChanged = allMails.slice(
                              Math.min(startIndex, endIndex),
                              Math.max(startIndex, endIndex) + 1
                            )

                            if (selected.includes(lastSelected ?? '')) {
                              if (selected.includes(mail)) {
                                setSelected(selected =>
                                  selected.filter(
                                    id =>
                                      !toBeChanged.map(m => m.id).includes(id)
                                  )
                                )
                              } else {
                                setSelected(selected =>
                                  selected.concat(
                                    toBeChanged
                                      .map(m => m.id)
                                      .filter(id => !selected.includes(id))
                                  )
                                )
                              }
                            } else {
                              if (selected.includes(mail)) {
                                setSelected(selected =>
                                  selected.filter(
                                    id =>
                                      !toBeChanged.map(m => m.id).includes(id)
                                  )
                                )
                              } else {
                                setSelected([
                                  ...selected,
                                  ...toBeChanged.map(m => m.id)
                                ])
                              }
                            }

                            setLastSelected(mail)
                          }}
                          onView={mail => {
                            setViewMailFor(mail)
                          }}
                        />
                      ))
                    ) : (
                      <EmptyStateScreen
                        icon={(() => {
                          switch (searchParams.get('label')) {
                            case 'inbox':
                              return 'tabler:inbox-off'
                            case 'starred':
                              return 'tabler:star-off'
                            case 'sent':
                              return 'tabler:send-off'
                            case 'draft':
                              return 'tabler:file-off'
                            case 'trash':
                              return 'tabler:trash-off'
                            case 'all-mails':
                              return 'tabler:mail-off'
                            default:
                              return 'tabler:search-off'
                          }
                        })()}
                        name={(() => {
                          switch (searchParams.get('label')) {
                            case 'inbox':
                            case 'starred':
                            case 'sent':
                            case 'draft':
                            case 'trash':
                              return (
                                searchParams.get('label') ?? 'filtered mails'
                              )
                            case 'all-mails':
                              return 'all mails'
                            default:
                              return 'filtered mails'
                          }
                        })()}
                        namespace="modules.mailInbox"
                      />
                    )}
                  </div>
                  <Pagination
                    className="mb-6"
                    currentPage={page}
                    totalPages={mails.totalPages}
                    onPageChange={setPage}
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
      <DeleteConfirmationModal
        apiEndpoint={
          searchParams.get('label') === 'trash'
            ? 'mail-inbox/entries/permanent'
            : 'mail-inbox/entries'
        }
        customText={
          searchParams.get('label') === 'trash'
            ? 'These mails will be deleted permanently. Are you sure?'
            : undefined
        }
        customTitle={
          searchParams.get('label') === 'trash'
            ? 'Delete Permanently'
            : undefined
        }
        data={selected}
        isOpen={deleteConfirmationModalOpen}
        itemName="mail"
        updateDataList={() => {
          refreshMails()
          refreshLabels()
        }}
        onClose={() => {
          setSelected([])
          setDeleteConfirmationModalOpen(false)
        }}
      />
      <DeleteConfirmationModal
        apiEndpoint="mail-inbox/entries/empty-trash"
        customText="All mails in trash will be deleted permanently. Are you sure?"
        customTitle="Empty Trash"
        isOpen={emptyTrashConfirmationModalOpen}
        onClose={() => {
          setEmptyTrashConfirmationModalOpen(false)
          refreshMails()
        }}
      />
    </ModuleWrapper>
  )
}

export default MailInbox
