import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ListboxInput from '@components/ButtonsAndInputs/ListboxInput'
import ListboxNullOption from '@components/ButtonsAndInputs/ListboxInput/components/ListboxNullOption'
import ListboxOption from '@components/ButtonsAndInputs/ListboxInput/components/ListboxOption'
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
      <ListboxNullOption icon="tabler:progress-help" hasBgColor />
      {statuses.map(({ name, id, icon, color }, i) => (
        <ListboxOption
          key={i}
          value={id}
          text={name}
          icon={icon}
          color={color}
        />
      ))}
    </ListboxInput>
  )
}

export default StatusSelector
