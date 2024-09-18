import { Listbox, ListboxOption } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ListboxInput from '@components/ButtonsAndInputs/ListboxInput'
import { type IProjectsMVisibility } from '@interfaces/projects_m_interfaces'

function VisibilitySelector({
  visibility,
  setVisibility,
  visibilities
}: {
  visibility: string | null
  setVisibility: React.Dispatch<React.SetStateAction<string | null>>
  visibilities: IProjectsMVisibility[] | 'loading' | 'error'
}): React.ReactElement {
  const { t } = useTranslation()

  if (visibilities === 'loading') {
    return <div>Loading...</div>
  }

  if (visibilities === 'error') {
    return <div>Error</div>
  }

  return (
    <ListboxInput
      name={t('input.projectVisibility')}
      icon="tabler:eye"
      value={visibility}
      setValue={setVisibility}
      buttonContent={
        <>
          <Icon
            icon={
              visibilities.find(l => l.id === visibility)?.icon ??
              'tabler:eye-off'
            }
            className="size-5"
          />
          <span className="-mt-px block truncate">
            {visibilities.find(l => l.id === visibility)?.name ?? 'None'}
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
                <span className="rounded-md p-2">
                  <Icon
                    icon="tabler:eye-off"
                    className="size-5"
                    style={{ color: 'white' }}
                  />
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
      {visibilities.map(({ name, id, icon }, i) => (
        <Listbox.Option
          key={i}
          className={({ active }) =>
            `relative cursor-pointer select-none transition-all p-4 flex flex-between ${
              active
                ? 'hover:bg-bg-100 dark:hover:bg-bg-700/50'
                : '!bg-transparent'
            }`
          }
          value={id}
        >
          {({ selected }) => (
            <>
              <div>
                <span className="flex items-center gap-2 font-medium">
                  <span className="rounded-md p-2">
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

export default VisibilitySelector
