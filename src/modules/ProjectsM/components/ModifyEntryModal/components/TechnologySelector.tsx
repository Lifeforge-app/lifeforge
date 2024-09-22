import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ListboxInput from '@components/ButtonsAndInputs/ListboxInput'
import ListboxOption from '@components/ButtonsAndInputs/ListboxInput/components/ListboxOption'
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
      {technologies.map(({ name, id, icon }) => (
        <ListboxOption key={id} value={id} text={name} icon={icon} />
      ))}
    </ListboxInput>
  )
}

export default TechnologySelector
