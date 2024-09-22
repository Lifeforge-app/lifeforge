import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ListboxInput from '@components/ButtonsAndInputs/ListboxInput'
import ListboxNullOption from '@components/ButtonsAndInputs/ListboxInput/components/ListboxNullOption'
import ListboxOption from '@components/ButtonsAndInputs/ListboxInput/components/ListboxOption'
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
      <ListboxNullOption icon="tabler:eye-off" />
      {visibilities.map(({ name, id, icon }, i) => (
        <ListboxOption key={i} value={id} text={name} icon={icon} />
      ))}
    </ListboxInput>
  )
}

export default VisibilitySelector
