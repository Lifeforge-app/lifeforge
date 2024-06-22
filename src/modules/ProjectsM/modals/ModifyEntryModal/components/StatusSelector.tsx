import { Listbox } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ListboxInputWrapper from '@components/Listbox/ListboxInputWrapper'
import ListboxTransition from '@components/Listbox/ListboxTransition'
import { type IProjectsMStatus } from '@interfaces/projects_m_interfaces'

function StatusSelector({
  status,
  setStatus,
  statuses
}: {
  status: string | null
  setStatus: React.Dispatch<React.SetStateAction<string | null>>
  statuses: IProjectsMStatus[] | 'loading' | 'error'
}): React.ReactElement {
  const { t } = useTranslation()

  if (statuses === 'loading') {
    return <div>Loading...</div>
  }

  if (statuses === 'error') {
    return <div>Error</div>
  }

  return (
    <ListboxInputWrapper value={status} onChange={setStatus}>
      <Listbox.Button className="flex w-full items-center">
        <Icon
          icon="tabler:progress"
          className={`ml-6 size-6 shrink-0 ${
            status !== null ? '' : 'text-bg-500'
          } group-focus-within:!text-custom-500`}
        />
        <span
          className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-bg-500 group-focus-within:!text-custom-500 ${'top-6 -translate-y-1/2 text-[14px]'}`}
        >
          {t('input.projectStatus')}
        </span>
        <div className="relative mb-3 mt-10 flex w-full items-center gap-2 rounded-lg pl-5 pr-10 text-left focus:outline-none">
          <Icon
            icon={
              statuses.find(l => l.id === status)?.icon ??
              'tabler:progress-help'
            }
            style={{
              color: statuses.find(l => l.id === status)?.color
            }}
            className="size-5"
          />
          <span className="-mt-px block truncate">
            {statuses.find(l => l.id === status)?.name ?? 'None'}
          </span>
        </div>
        <span className="pointer-events-none absolute inset-y-0 right-0 mt-1 flex items-center pr-4">
          <Icon icon="tabler:chevron-down" className="size-5 text-bg-500" />
        </span>
      </Listbox.Button>
      <ListboxTransition>
        <Listbox.Options className="absolute bottom-[120%] z-[100] mt-1 max-h-56 w-full divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base shadow-lg focus:outline-none dark:divide-bg-700 dark:bg-bg-800">
          <Listbox.Option
            key={'none'}
            className={({ active }) =>
              `relative cursor-pointer select-none transition-all p-4 flex items-center justify-between ${
                active ? 'bg-bg-200/50 dark:bg-bg-700/50' : '!bg-transparent'
              }`
            }
            value={null}
          >
            {({ selected }) => (
              <>
                <div>
                  <span className="flex items-center gap-2 font-medium">
                    <span
                      className="rounded-md p-2"
                      style={{
                        backgroundColor: '#FFFFFF20',
                        color: '#FFFFFF'
                      }}
                    >
                      <Icon icon="tabler:progress-help" className="size-5" />
                    </span>

                    <span>None</span>
                  </span>
                </div>
                {selected && (
                  <Icon
                    icon="tabler:check"
                    className="block text-lg text-custom-500"
                  />
                )}
              </>
            )}
          </Listbox.Option>
          {statuses.map(({ name, id, icon, color }, i) => (
            <Listbox.Option
              key={i}
              className={({ active }) =>
                `relative cursor-pointer select-none transition-all p-4 flex items-center justify-between ${
                  active ? 'bg-bg-200/50 dark:bg-bg-700/50' : '!bg-transparent'
                }`
              }
              value={id}
            >
              {({ selected }) => (
                <>
                  <div>
                    <span className="flex items-center gap-2 font-medium">
                      <span
                        className="rounded-md p-2"
                        style={{
                          backgroundColor: color + '20',
                          color
                        }}
                      >
                        <Icon icon={icon} className="size-5" />
                      </span>
                      {name}
                    </span>
                  </div>
                  {selected && (
                    <Icon
                      icon="tabler:check"
                      className="block text-lg text-custom-500"
                    />
                  )}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </ListboxTransition>
    </ListboxInputWrapper>
  )
}

export default StatusSelector
