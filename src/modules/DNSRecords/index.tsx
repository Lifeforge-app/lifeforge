/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Listbox, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState } from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'

export interface IDNSRecordEntry {
  line_index: number
  text_b64?: string
  type: Type
  dname_b64?: string
  ttl?: number
  record_type?: RecordType
  data_b64?: string[]
}

export enum RecordType {
  A = 'A',
  Aaaa = 'AAAA',
  Cname = 'CNAME',
  NS = 'NS',
  SOA = 'SOA',
  Txt = 'TXT'
}

export enum Type {
  Comment = 'comment',
  Control = 'control',
  Record = 'record'
}

const FILTER_TYPE = ['All', 'A', 'AAAA', 'CNAME', 'TXT']

function DNSRecords(): JSX.Element {
  const [records] = useFetch<IDNSRecordEntry[]>('dns-records/list')
  const [searchQuery, setSearchQuery] = React.useState<string>('')
  const [selected, setSelected] = useState(FILTER_TYPE[0])

  console.log(records)

  return (
    <ModuleWrapper>
      <ModuleHeader
        title="DNS Records"
        desc="..."
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
      />
      <div className="flex items-center gap-2">
        <SearchInput
          stuffToSearch="DNS records"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <Listbox
          value={selected}
          onChange={setSelected}
          as="div"
          className="relative"
        >
          <Listbox.Button className="relative mt-6 flex w-40 items-center justify-between gap-4 whitespace-nowrap rounded-lg bg-bg-900 p-4 text-left">
            <div className="flex items-center gap-4">
              <Icon icon="tabler:filter" className="h-5 w-5 text-bg-500" />
              {selected}
            </div>
            <Icon icon="tabler:chevron-down" className="h-5 w-5 text-bg-500" />
          </Listbox.Button>
          <Transition
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute top-[5.2rem] z-50 mt-1 max-h-56 w-full divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base shadow-lg focus:outline-none dark:divide-bg-700 dark:bg-bg-800 sm:text-sm">
              {FILTER_TYPE.map(type => (
                <Listbox.Option
                  key={type}
                  value={type}
                  className={({ active }) =>
                    `relative cursor-pointer select-none transition-all p-4 flex items-center justify-between ${
                      active
                        ? 'bg-bg-200/50 dark:bg-bg-700/50'
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
                          className="h-5 w-5 text-white group-hover:text-white/50"
                        />
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </Listbox>
      </div>
      <APIComponentWithFallback data={records}>
        {typeof records !== 'string' && (
          <table className="mb-8 mt-6">
            <thead>
              <tr className="border-b-2 border-bg-900">
                <th scope="col" className="p-4">
                  Name
                </th>
                <th scope="col" className="p-4">
                  TTL
                </th>
                <th scope="col" className="p-4">
                  Type
                </th>
                <th scope="col" className="p-4">
                  Data
                </th>
                <th scope="col" className="p-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {records
                .filter(e => e.type === 'record')
                .filter(
                  record =>
                    record.dname_b64
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase()) ??
                    record.data_b64
                      ?.join(' ')
                      .toLowerCase()
                      .includes(searchQuery)
                )
                .filter(
                  record =>
                    selected === 'All' || record.record_type === selected
                )
                .sort((a, b) => a.line_index - b.line_index)
                .map((record, index) => (
                  <tr key={index} className="even:bg-bg-900">
                    <td className="p-4">
                      {record.dname_b64 +
                        (!record.dname_b64!.endsWith('.')
                          ? '.' +
                            (records[1].text_b64?.split(' ').pop() ?? '') +
                            '.'
                          : '')}
                    </td>
                    <td className="p-4 text-bg-500">{record.ttl}</td>
                    <td className="p-4 text-center text-bg-500">
                      {record.record_type}
                    </td>
                    <td className="break-all p-4 text-bg-500">
                      {record.data_b64}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center gap-2">
                        <button className="rounded-md p-2 text-bg-500">
                          <Icon icon="tabler:pencil" className="h-6 w-6" />
                        </button>
                        <button className="rounded-md p-2 text-red-500">
                          <Icon icon="tabler:trash" className="h-6 w-6" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </APIComponentWithFallback>
    </ModuleWrapper>
  )
}

export default DNSRecords
