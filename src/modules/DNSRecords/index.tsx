/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions
} from '@headlessui/react'
import { Icon } from '@iconify/react'
import React, { useEffect, useState, type JSX } from 'react'
import { toast } from 'react-toastify'
import Button from '@components/ButtonsAndInputs/Button'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import Scrollbar from '@components/Scrollbar'
import useFetch from '@hooks/useFetch'
import {
  DNSRecordType,
  type IDNSRecordEntry
} from '@interfaces/dns_records_interfaces'
import APIRequest from '@utils/fetchData'
import IconButton from '../Music/components/Bottombar/components/IconButton'

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
  const [filteredRecords, setFilteredRecords] = useState<
    IDNSRecordEntry[] | 'loading' | 'error'
  >('loading')
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
    await APIRequest({
      endpoint: `dns-records?serial=${serial}`,
      body: {
        target: Array.isArray(index) ? index : [index]
      },
      method: 'DELETE',
      callback() {
        updateRawRecords()
      },
      successInfo: 'delete',
      failureInfo: 'delete',
      finalCallback() {
        if (typeof index === 'number') {
          setDeleteLoading(-1)
        } else {
          setBulkDeleteLoading(false)
          setSelectedEntries([])
          setIsSelecting(false)
        }
      }
    })
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
        icon="tabler:cloud"
        title="DNS Records"
        desc="..."
        totalItems={
          typeof filteredRecords === 'string'
            ? undefined
            : filteredRecords.length
        }
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
        hasHamburgerMenu
        hamburgerMenuItems={
          <>
            <MenuItem
              icon="tabler:select"
              text="Select"
              onClick={() => {
                setIsSelecting(!isSelecting)
                setSelectedEntries([])
              }}
              isToggled={isSelecting}
            />
          </>
        }
      />
      <div className="flex items-center gap-2">
        <SearchInput
          stuffToSearch="DNS records"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <Listbox
          value={selectedFilter}
          onChange={setSelectedFilter}
          as="div"
          className="relative"
        >
          <ListboxButton className="flex-between relative mt-6 flex w-40 gap-4 whitespace-nowrap rounded-lg bg-bg-50 p-4 text-left shadow-custom dark:bg-bg-900">
            <div className="flex items-center gap-4">
              <Icon icon="tabler:filter" className="size-5 text-bg-500" />
              {selectedFilter}
            </div>
            <Icon icon="tabler:chevron-down" className="size-5 text-bg-500" />
          </ListboxButton>
          <ListboxOptions
            transition
            anchor="bottom end"
            className="w-96 rounded-md bg-bg-100 text-bg-800 shadow-lg outline-none transition duration-100 ease-out [--anchor-gap:8px] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 dark:bg-bg-800 dark:text-bg-100"
          >
            <Scrollbar autoHeight autoHeightMax={300}>
              {FILTER_TYPE.map(type => (
                <ListboxOption
                  key={type}
                  value={type}
                  className={({ active }) =>
                    `relative cursor-pointer select-none transition-all p-4 flex flex-between ${
                      active
                        ? 'hover:bg-bg-200/50 dark:hover:bg-bg-700/50'
                        : '!bg-transparent'
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      {type}
                      {selected && (
                        <Icon
                          icon="tabler:check"
                          className="size-5 text-white group-hover:text-white/50"
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
            disabled={selectedEntries.length === 0 || bulkDeleteLoading}
            loading={bulkDeleteLoading}
            onClick={() => {
              setDeleteConfirmationModalOpen(true)
            }}
            icon="tabler:trash"
            isRed
            className="mt-2 whitespace-nowrap sm:mt-6"
          >
            Bulk Delete
          </Button>
        )}
      </div>
      <Scrollbar className="mt-6">
        <APIComponentWithFallback data={filteredRecords}>
          {records =>
            records.length === 0 ? (
              <EmptyStateScreen
                icon="tabler:search-off"
                title="No DNS records found"
                description="There is no DNS record related to your search query."
              />
            ) : (
              <table className="mb-16">
                <thead>
                  <tr className="border-b-2 border-bg-200 dark:border-bg-800">
                    <th className="pl-4 pr-0">
                      <div
                        className={`${
                          isSelecting ? 'w-6' : 'w-0'
                        } flex items-center justify-center overflow-hidden transition-all`}
                      >
                        <button
                          onClick={() => {
                            toggleSelected('all')
                          }}
                          className={`size-5 rounded-full border-[1.5px] ${
                            records.every(record =>
                              selectedEntries.includes(record.line_index)
                            )
                              ? 'border-custom-500'
                              : 'border-bg-300 dark:border-bg-700'
                          }`}
                        >
                          {records.every(record =>
                            selectedEntries.includes(record.line_index)
                          ) && (
                            <Icon
                              icon="uil:check"
                              className="mr-[2px] mt-px size-4 text-custom-500"
                            />
                          )}
                        </button>
                      </div>
                    </th>
                    {['Name', 'TTL', 'Type', 'Data'].map(header => (
                      <th
                        key={header}
                        scope="col"
                        className="relative p-4 pr-16"
                      >
                        {header}
                        <IconButton
                          icon="tabler:transfer-vertical"
                          onClick={() => {
                            setSortBy(header)
                          }}
                          className={`absolute right-4 top-1/2 -translate-y-1/2 !p-2 hover:bg-bg-800/70 ${
                            sortBy === header
                              ? 'text-bg-800 dark:text-bg-100'
                              : 'text-bg-500'
                          }`}
                        />
                      </th>
                    ))}

                    <th scope="col" className="p-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {records.map(record => (
                    <tr
                      key={record.line_index}
                      onClick={() => {
                        if (!isSelecting) return
                        toggleSelected(record.line_index)
                      }}
                      className={`${
                        isSelecting
                          ? 'cursor-pointer hover:bg-bg-200 dark:hover:bg-bg-900/50'
                          : ''
                      }`}
                    >
                      <td className="pl-4 pr-0">
                        <div
                          className={`${
                            isSelecting ? 'w-6' : 'w-0'
                          } flex items-center justify-center overflow-hidden transition-all`}
                        >
                          <button
                            onClick={() => {
                              toggleSelected(record.line_index)
                            }}
                            className={`size-5 rounded-full border-[1.5px] ${
                              selectedEntries.includes(record.line_index)
                                ? 'border-custom-500'
                                : 'border-bg-300 dark:border-bg-700'
                            }`}
                          >
                            {selectedEntries.includes(record.line_index) && (
                              <Icon
                                icon="uil:check"
                                className="mr-[2px] mt-px size-4 text-custom-500"
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
                                ((rawRecords[1] as IDNSRecordEntry).text_b64
                                  ?.split(' ')
                                  .pop() ?? '')
                              : '')

                          return (
                            <a
                              href={`http://${link}`}
                              target="_blank"
                              rel="noreferrer"
                              className={
                                isSelecting ? 'pointer-events-none' : ''
                              }
                            >
                              {link}.
                            </a>
                          )
                        })()}
                      </td>
                      <td className="p-4 pr-16 text-center text-bg-500">
                        {record.ttl}
                      </td>
                      <td className="p-4 pr-16 text-center text-bg-500">
                        {record.record_type}
                      </td>
                      <td className="break-all p-4 pr-16 text-bg-500">
                        {record.data_b64}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex w-full items-center justify-center gap-2">
                          <button className="rounded-md p-2 text-bg-500 transition-all hover:bg-bg-200/20 hover:text-bg-800 dark:hover:bg-bg-800/70 dark:hover:text-bg-100">
                            <Icon icon="tabler:pencil" className="size-6" />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteConfirmationModalOpen(record.line_index)
                            }}
                            className="rounded-md p-2 text-red-500 transition-all hover:bg-red-500/20 hover:text-red-600 disabled:text-bg-500 disabled:hover:bg-transparent disabled:hover:text-bg-500"
                            disabled={deleteLoading !== -1}
                          >
                            <Icon
                              icon={
                                deleteLoading === record.line_index
                                  ? 'svg-spinners:180-ring'
                                  : 'tabler:trash'
                              }
                              className="size-6"
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
        </APIComponentWithFallback>
      </Scrollbar>
      <DeleteConfirmationModal
        isOpen={deleteConfirmationModalOpen !== false}
        onClose={() => {
          setDeleteConfirmationModalOpen(false)
        }}
        customCallback={async () => {
          await removeRecord(
            typeof deleteConfirmationModalOpen === 'number'
              ? deleteConfirmationModalOpen
              : selectedEntries
          ).catch(console.error)
        }}
        itemName="DNS record"
        customText="Are you sure you want to delete the selected record(s)?"
      />
    </ModuleWrapper>
  )
}

export default DNSRecords
