import { Listbox, ListboxButton } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { toast } from 'react-toastify'

import {
  ListboxOrComboboxOption,
  ListboxOrComboboxOptions,
  SearchInput,
  ViewModeSelector
} from '@lifeforge/ui'

import useComponentBg from '@hooks/useComponentBg'

import fetchAPI from '@utils/fetchAPI'

import { IGuitarTabsEntry } from '../interfaces/guitar_tabs_interfaces'

const SORT_TYPE = [
  ['tabler:clock', 'newest'],
  ['tabler:clock', 'oldest'],
  ['tabler:at', 'author'],
  ['tabler:abc', 'name']
]

function Searchbar({
  view,
  setView,
  searchQuery,
  setSearchQuery
}: {
  view: 'grid' | 'list'
  setView: React.Dispatch<React.SetStateAction<'grid' | 'list'>>
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
}) {
  const { t } = useTranslation('apps.guitarTabs')
  const { componentBgWithHover } = useComponentBg()
  const [searchParams, setSearchParams] = useSearchParams()
  const [requestRandomLoading, setRequestRandomLoading] = useState(false)

  async function requestRandomEntry() {
    setRequestRandomLoading(true)

    try {
      const entry = await fetchAPI<IGuitarTabsEntry>(
        '/guitar-tabs/entries/random'
      )

      const url = `${import.meta.env.VITE_API_HOST}/media/${entry.collectionId}/${
        entry.id
      }/${entry.pdf}`

      window.open(url, '_blank')
      setRequestRandomLoading(false)
    } catch {
      toast.error('Failed to fetch random entry')
    } finally {
      setRequestRandomLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Listbox
        as="div"
        className="relative hidden md:block"
        value={searchParams.get('sort') ?? 'newest'}
        onChange={value => {
          searchParams.set('sort', value)
          setSearchParams(searchParams)
        }}
      >
        <ListboxButton
          className={clsx(
            'flex-between shadow-custom mt-4 flex w-48 gap-2 rounded-md p-4',
            componentBgWithHover
          )}
        >
          <div className="flex items-center gap-2">
            <Icon
              className="size-6"
              icon={
                SORT_TYPE.find(
                  ([, value]) => value === searchParams.get('sort')
                )?.[0] ?? 'tabler:clock'
              }
            />
            <span className="font-medium whitespace-nowrap">
              {t(
                `sortTypes.${
                  SORT_TYPE.find(
                    ([, value]) => value === searchParams.get('sort')
                  )?.[1] ?? 'newest'
                }`
              )}
            </span>
          </div>
          <Icon className="text-bg-500 size-5" icon="tabler:chevron-down" />
        </ListboxButton>
        <ListboxOrComboboxOptions>
          {SORT_TYPE.map(([icon, value]) => (
            <ListboxOrComboboxOption
              key={value}
              icon={icon}
              text={t(`sortTypes.${value}`)}
              value={value}
            />
          ))}
        </ListboxOrComboboxOptions>
      </Listbox>
      <SearchInput
        namespace="apps.guitarTabs"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sideButtonIcon="tabler:dice"
        sideButtonLoading={requestRandomLoading}
        stuffToSearch="score"
        onSideButtonClick={requestRandomEntry}
      />
      <ViewModeSelector
        className="hidden md:flex"
        options={[
          { value: 'list', icon: 'uil:list-ul' },
          { value: 'grid', icon: 'uil:apps' }
        ]}
        setViewMode={setView}
        viewMode={view}
      />
    </div>
  )
}

export default Searchbar
