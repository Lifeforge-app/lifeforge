import { Listbox, ListboxOption } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ListboxInput from '@components/ButtonsAndInputs/ListboxInput'
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
    <ListboxInput
      name={t('input.projectStatus')}
      icon="tabler:progress"
      value={status}
      setValue={setStatus}
      buttonContent={
        <>
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
        </>
      }
    >
      <ListboxOption
        key={'none'}
        className="flex-between relative flex cursor-pointer select-none bg-bg-200/50 p-4 transition-all dark:bg-bg-700/50"
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
      </ListboxOption>
      {statuses.map(({ name, id, icon, color }, i) => (
        <Listbox.Option
          key={i}
          className={({ active }) =>
            `relative cursor-pointer select-none transition-all p-4 flex flex-between ${
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
    </ListboxInput>
  )
}

export default StatusSelector
