import { Listbox } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ListboxTransition from '@components/Listbox/ListboxTransition'
import { type IProjectsMTechnology } from '@interfaces/projects_m_interfaces'

function TechnologySelector({
  selectedTechnologies,
  setSelectedTechnologies,
  technologies
}: {
  selectedTechnologies: string[]
  setSelectedTechnologies: React.Dispatch<React.SetStateAction<string[]>>
  technologies: IProjectsMTechnology[] | 'loading' | 'error'
}): React.ReactElement {
  const { t } = useTranslation()

  if (technologies === 'loading') {
    return <div>Loading...</div>
  }

  if (technologies === 'error') {
    return <div>Error</div>
  }

  return (
    <Listbox
      value={selectedTechnologies}
      multiple
      onChange={setSelectedTechnologies}
      as="div"
      className="group relative mt-4 flex items-center gap-1 rounded-t-lg border-b-2 border-bg-500 bg-bg-200/50 shadow-custom focus-within:!border-custom-500 dark:bg-bg-800/50"
    >
      <Listbox.Button className="flex w-full items-center">
        <Icon
          icon="tabler:flask"
          className={`ml-6 size-6 shrink-0 ${
            selectedTechnologies !== null ? '' : 'text-bg-500'
          } group-focus-within:!text-custom-500`}
        />
        <span
          className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-bg-500 group-focus-within:!text-custom-500 ${'top-6 -translate-y-1/2 text-[14px]'}`}
        >
          {t('input.projectTechnologies')}
        </span>
        <div className="relative mb-3 mt-10 flex w-full items-center gap-2 rounded-lg pl-5 pr-10 text-left focus:outline-none">
          {selectedTechnologies.length > 0 ? (
            selectedTechnologies.map(technology => (
              <Icon
                key={technology}
                icon={
                  technologies.find(l => l.id === technology)?.icon ??
                  'tabler:flask-off'
                }
                className="size-5"
              />
            ))
          ) : (
            <>
              <Icon icon="tabler:flask-off" className="size-5" />
              None
            </>
          )}
        </div>
        <span className="pointer-events-none absolute inset-y-0 right-0 mt-1 flex items-center pr-4">
          <Icon icon="tabler:chevron-down" className="size-5 text-bg-500" />
        </span>
      </Listbox.Button>
      <ListboxTransition>
        <Listbox.Options className="absolute bottom-[120%] z-[100] mt-1 max-h-56 w-full divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base shadow-lg focus:outline-none dark:divide-bg-700 dark:bg-bg-800">
          {technologies.map(({ name, id, icon }, i) => (
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
        </Listbox.Options>
      </ListboxTransition>
    </Listbox>
  )
}

export default TechnologySelector
