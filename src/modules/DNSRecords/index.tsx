import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions
} from '@headlessui/react'
import { Icon } from '@iconify/react'
import fetchAPI from '@utils/fetchAPI'
import clsx from 'clsx'
import React, { type JSX, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import {
  APIFallbackComponent,
  Button,
  DeleteConfirmationModal,
  EmptyStateScreen,
  MenuItem,
  Scrollbar,
  SearchInput
} from '@lifeforge/ui'
import { ModuleWrapper } from '@lifeforge/ui'
import { ModuleHeader } from '@lifeforge/ui'

import { type Loadable } from '@interfaces/common'

import useFetch from '@hooks/useFetch'

import IconButton from '../Music/components/Bottombar/components/IconButton'
import {
  DNSRecordType,
  type IDNSRecordEntry
} from './interfaces/dns_records_interfaces'

const FILTER_TYPE = ['All', 'A', 'AAAA', 'CNAME', 'TXT']

function DNSRecords(): JSX.Element {
  const [rawRecords, updateRawRecords] =
    useFetch<IDNSRecordEntry[]>('dns-records/list')
  const [searchQuery, setSearchQuery] = React.useState<string>('')
  const [serial, setSerial] = useState('')
  const [selectedFilter, setSelectedFilter] = useState(FILTER_TYPE[0])
  const [selectedEntries, setSelectedEntries] = useState<number[]>([])
  const [sortBy, setSortBy] = useState('Name')
  const [deleteLoading, setDeleteLoading] = useState<number>(-1)
  const [isSelecting, setIsSelecting] = useState(false)
  const [filteredRecords, setFilteredRecords] =
    useState<Loadable<IDNSRecordEntry[]>>('loading')
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false)
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState<boolean | number>(false)

  async function removeRecord(index: number | number[]): Promise<void> {
    if (serial === '') {
      toast.error('Serial not found, try reloading the page')
    }

    if (typeof index === 'number') {
      setDeleteLoading(index)
    } else {
      setBulkDeleteLoading(true)
    }

    try {
      await fetchAPI(`dns-records?serial=${serial}`, {
        method: 'DELETE',
        body: {
          target: Array.isArray(index) ? index : [index]
        }
      })

      updateRawRecords()
    } catch {
      toast.error('Failed to delete DNS record')
    } finally {
      if (typeof index === 'number') {
        setDeleteLoading(-1)
      } else {
        setBulkDeleteLoading(false)
        setSelectedEntries([])
        setIsSelecting(false)
      }
    }
  }

  function toggleSelected(index: number | 'all'): void {
    if (typeof filteredRecords === 'string') return

    if (index === 'all') {
      if (
        filteredRecords.every(record =>
          selectedEntries.includes(record.line_index)
        )
      ) {
        setSelectedEntries([])
      } else {
        setSelectedEntries(filteredRecords.map(record => record.line_index))
      }
      return
    }

    if (selectedEntries.includes(index)) {
      setSelectedEntries(selectedEntries.filter(e => e !== index))
    } else {
      setSelectedEntries([...selectedEntries, index])
    }
  }

  useEffect(() => {
    if (typeof rawRecords === 'string') return

    const SOA = rawRecords.find(e => e.record_type === DNSRecordType.SOA)
    if (SOA !== undefined) {
      setSerial(SOA.data_b64![2])
    }
  }, [rawRecords])

  useEffect(() => {
    if (typeof rawRecords === 'string') {
      setFilteredRecords(rawRecords)
      return
    }

    setFilteredRecords(
      rawRecords
        .filter(e => e.type === 'record')
        .filter(
          record =>
            record.dname_b64
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ??
            record.data_b64?.join(' ').toLowerCase().includes(searchQuery)
        )
        .filter(
          record =>
            selectedFilter === 'All' || record.record_type === selectedFilter
        )
        .sort((a, b) => a.line_index - b.line_index)
        .sort((a, b) => {
          if (sortBy === 'Name') {
            return a.dname_b64!.localeCompare(b.dname_b64!)
          } else if (sortBy === 'TTL') {
            return a.ttl! - b.ttl!
          } else if (sortBy === 'Type') {
            return a.record_type!.localeCompare(b.record_type!)
          } else {
            return a.data_b64!.join(' ').localeCompare(b.data_b64!.join(' '))
          }
        })
    )
  }, [rawRecords, searchQuery, selectedFilter, sortBy])

  return (
    <ModuleWrapper>
      <ModuleHeader
        actionButton={
          <Button
            icon="tabler:plus"
            onClick={() => {
              console.log('add dns record')
            }}
          >
            Add Record
          </Button>
        }
        hamburgerMenuItems={
          <>
            <MenuItem
              icon="tabler:select"
              isToggled={isSelecting}
              text="Select"
              onClick={() => {
                setIsSelecting(!isSelecting)
                setSelectedEntries([])
              }}
            />
          </>
        }
        icon="tabler:cloud"
        title="DNS Records"
        totalItems={
          typeof filteredRecords === 'string'
            ? undefined
            : filteredRecords.length
        }
      />
      <div className="flex items-center gap-2">
        <SearchInput
          namespace="modules.dnsRecords"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stuffToSearch="dnsRecord"
        />
        <Listbox
          as="div"
          className="relative"
          value={selectedFilter}
          onChange={setSelectedFilter}
        >
          <ListboxButton className="flex-between bg-bg-50 shadow-custom dark:bg-bg-900 relative mt-6 flex w-40 gap-4 whitespace-nowrap rounded-lg p-4 text-left">
            <div className="flex items-center gap-4">
              <Icon className="text-bg-500 size-5" icon="tabler:filter" />
              {selectedFilter}
            </div>
            <Icon className="text-bg-500 size-5" icon="tabler:chevron-down" />
          </ListboxButton>
          <ListboxOptions
            transition
            anchor="bottom end"
            className="bg-bg-100 text-bg-800 dark:bg-bg-800 dark:text-bg-50 outline-hidden focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 w-96 rounded-md shadow-lg transition duration-100 ease-out [--anchor-gap:8px]"
          >
            <Scrollbar autoHeight autoHeightMax={300}>
              {FILTER_TYPE.map(type => (
                <ListboxOption
                  key={type}
                  className={({ active }) =>
                    `flex-between relative flex cursor-pointer select-none p-4 transition-all ${
                      active
                        ? 'hover:bg-bg-100 dark:hover:bg-bg-700/50'
                        : 'bg-transparent!'
                    }`
                  }
                  value={type}
                >
                  {({ selected }) => (
                    <>
                      {type}
                      {selected && (
                        <Icon
                          className="size-5 text-white group-hover:text-white/50"
                          icon="tabler:check"
                        />
                      )}
                    </>
                  )}
                </ListboxOption>
              ))}
            </Scrollbar>
          </ListboxOptions>
        </Listbox>
        {selectedEntries.length > 0 && (
          <Button
            isRed
            className="mt-2 whitespace-nowrap"
            disabled={selectedEntries.length === 0 || bulkDeleteLoading}
            icon="tabler:trash"
            loading={bulkDeleteLoading}
            onClick={() => {
              setDeleteConfirmationModalOpen(true)
            }}
          >
            Bulk Delete
          </Button>
        )}
      </div>
      <Scrollbar className="mt-6">
        <APIFallbackComponent data={filteredRecords}>
          {records =>
            records.length === 0 ? (
              <EmptyStateScreen
                icon="tabler:search-off"
                name="dnsRecords"
                namespace="modules.dnsRecords"
              />
            ) : (
              <table className="mb-8">
                <thead>
                  <tr className="border-bg-200 dark:border-bg-800 border-b-2">
                    <th className="pl-4 pr-0">
                      <div
                        className={clsx(
                          'flex items-center justify-center overflow-hidden transition-all',
                          isSelecting && 'w-6'
                        )}
                      >
                        <button
                          className={clsx(
                            'size-5 rounded-full border-[1.5px]',
                            records.every(record =>
                              selectedEntries.includes(record.line_index)
                            )
                              ? 'border-custom-500'
                              : 'border-bg-300 dark:border-bg-700'
                          )}
                          onClick={() => {
                            toggleSelected('all')
                          }}
                        >
                          {records.every(record =>
                            selectedEntries.includes(record.line_index)
                          ) && (
                            <Icon
                              className="text-custom-500 mr-[2px] mt-px size-4"
                              icon="uil:check"
                            />
                          )}
                        </button>
                      </div>
                    </th>
                    {['Name', 'TTL', 'Type', 'Data'].map(header => (
                      <th
                        key={header}
                        className="relative p-4 pr-16"
                        scope="col"
                      >
                        {header}
                        <IconButton
                          className={clsx(
                            'hover:bg-bg-800/50 absolute right-4 top-1/2 -translate-y-1/2 !p-2',
                            sortBy === header
                              ? 'text-bg-800 dark:text-bg-50'
                              : 'text-bg-500'
                          )}
                          icon="tabler:transfer-vertical"
                          onClick={() => {
                            setSortBy(header)
                          }}
                        />
                      </th>
                    ))}

                    <th className="p-4" scope="col">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {records.map(record => (
                    <tr
                      key={record.line_index}
                      className={clsx(
                        isSelecting &&
                          'hover:bg-bg-200 dark:hover:bg-bg-900/50 cursor-pointer'
                      )}
                      onClick={() => {
                        if (!isSelecting) return
                        toggleSelected(record.line_index)
                      }}
                    >
                      <td className="pl-4 pr-0">
                        <div
                          className={clsx(
                            'flex items-center justify-center overflow-hidden transition-all',
                            isSelecting ? 'w-6' : 'w-0'
                          )}
                        >
                          <button
                            className={clsx(
                              'size-5 rounded-full border-[1.5px]',
                              selectedEntries.includes(record.line_index)
                                ? 'border-custom-500'
                                : 'border-bg-300 dark:border-bg-700'
                            )}
                            onClick={() => {
                              toggleSelected(record.line_index)
                            }}
                          >
                            {selectedEntries.includes(record.line_index) && (
                              <Icon
                                className="text-custom-500 mr-[2px] mt-px size-4"
                                icon="uil:check"
                              />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-4 pl-4 pr-16">
                        {(() => {
                          const link =
                            record.dname_b64 +
                            (!record.dname_b64!.endsWith('.')
                              ? '.' +
                                (rawRecords[1] as IDNSRecordEntry).text_b64
                                  ?.split(' ')
                                  .pop()
                              : '')

                          return (
                            <a
                              className={clsx(
                                isSelecting && 'pointer-events-none'
                              )}
                              href={`http://${link}`}
                              rel="noreferrer"
                              target="_blank"
                            >
                              {link}.
                            </a>
                          )
                        })()}
                      </td>
                      <td className="text-bg-500 p-4 pr-16 text-center">
                        {record.ttl}
                      </td>
                      <td className="text-bg-500 p-4 pr-16 text-center">
                        {record.record_type}
                      </td>
                      <td className="text-bg-500 break-all p-4 pr-16">
                        {record.data_b64}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex w-full items-center justify-center gap-2">
                          <button className="text-bg-500 hover:bg-bg-200/20 hover:text-bg-800 dark:hover:bg-bg-800/50 dark:hover:text-bg-50 rounded-md p-2 transition-all">
                            <Icon className="size-6" icon="tabler:pencil" />
                          </button>
                          <button
                            className="disabled:text-bg-500 disabled:hover:text-bg-500 rounded-md p-2 text-red-500 transition-all hover:bg-red-500/20 hover:text-red-600 disabled:hover:bg-transparent"
                            disabled={deleteLoading !== -1}
                            onClick={() => {
                              setDeleteConfirmationModalOpen(record.line_index)
                            }}
                          >
                            <Icon
                              className="size-6"
                              icon={
                                deleteLoading === record.line_index
                                  ? 'svg-spinners:180-ring'
                                  : 'tabler:trash'
                              }
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
        </APIFallbackComponent>
      </Scrollbar>
      <DeleteConfirmationModal
        customCallback={async () => {
          await removeRecord(
            typeof deleteConfirmationModalOpen === 'number'
              ? deleteConfirmationModalOpen
              : selectedEntries
          ).catch(console.error)
        }}
        customText="Are you sure you want to delete the selected record(s)?"
        isOpen={deleteConfirmationModalOpen !== false}
        itemName="DNS record"
        onClose={() => {
          setDeleteConfirmationModalOpen(false)
        }}
      />
    </ModuleWrapper>
  )
}

export default DNSRecords
