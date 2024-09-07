import { Listbox } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ListboxInput from '@components/ButtonsAndInputs/ListboxInput'
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
    <ListboxInput
      name={t('input.projectTechnologies')}
      icon="tabler:flask"
      value={selectedTechnologies}
      setValue={setSelectedTechnologies}
      multiple
      buttonContent={
        <>
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
        </>
      }
    >
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
    </ListboxInput>
  )
}

export default TechnologySelector
