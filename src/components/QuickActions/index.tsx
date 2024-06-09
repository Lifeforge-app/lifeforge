import { Icon } from '@iconify/react'
import { useDebounce } from '@uidotdev/usehooks'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { QUICK_ACTIONS } from '@constants/quick_actions'
import { ROUTES } from '@constants/routes_config'
import { titleToPath } from '@utils/strings'

function QuickActions(): React.ReactElement {
  const { t } = useTranslation()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const [filteredActions, setFilteredActions] = useState(QUICK_ACTIONS)

  useEffect(() => {
    setFilteredActions(
      Object.fromEntries(
        Object.entries(QUICK_ACTIONS).map(([key, value]) => [
          key,
          value.filter(action =>
            action.action
              .toLowerCase()
              .includes(debouncedSearchQuery.toLowerCase())
          )
        ])
      ) as typeof QUICK_ACTIONS
    )
  }, [debouncedSearchQuery])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <search className="relative hidden w-full items-center gap-4 rounded-lg bg-bg-50 p-4 shadow-custom dark:bg-bg-900 lg:flex">
      <Icon icon="tabler:search" className="size-5 text-bg-500" />
      <form className="w-full">
        <input
          ref={searchInputRef}
          onFocus={() => {
            setCommandPaletteOpen(true)
          }}
          onBlur={() => {
            setCommandPaletteOpen(false)
          }}
          type="text"
          autoComplete="false"
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value)
          }}
          placeholder={t('header.searchBarPlaceholder')}
          className="w-full bg-transparent placeholder:text-bg-500 focus:outline-none"
        />
      </form>
      {commandPaletteOpen && (
        <div className="absolute left-0 top-16 flex max-h-72 w-full flex-col gap-4 overflow-y-auto rounded-lg bg-bg-50 p-4 shadow-custom dark:bg-bg-900">
          {Object.entries(filteredActions).map(
            ([key, value]) =>
              value.length > 0 && (
                <div key={key} className="flex flex-col gap-2">
                  <div className="p-4 py-2 text-sm font-medium uppercase tracking-widest text-bg-500">
                    {t(`modules.title.${titleToPath(key)}`)}
                  </div>
                  <ul className="flex flex-col">
                    {value.map(action => (
                      <li
                        key={action.action}
                        className="group flex items-center gap-2 rounded-md px-4 py-2 hover:bg-bg-100 dark:hover:bg-bg-800"
                      >
                        <Icon
                          icon={
                            ROUTES.find(
                              route => route.title === key
                            )?.items.find(item => item.name === action.module)
                              ?.icon ?? 'tabler:circle'
                          }
                          className="size-5 text-bg-400 group-hover:!text-custom-500 dark:text-bg-500"
                        />
                        {action.action}
                      </li>
                    ))}
                  </ul>
                </div>
              )
          )}
        </div>
      )}
    </search>
  )
}

export default QuickActions
