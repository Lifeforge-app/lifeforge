import {
  ListboxOrComboboxInput,
  ListboxOrComboboxOption
} from '@components/inputs'
import { Location } from '@components/modals/features/FormModal/typescript/form_interfaces'
import { Icon } from '@iconify/react'
import { useDebounce } from '@uidotdev/usehooks'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fetchAPI, useAPIEndpoint, useAPIQuery } from 'shared'

import { Tooltip } from '../utilities'

function LocationInput({
  location,
  setLocation,
  namespace,
  label,
  required,
  disabled
}: {
  location: Location | null
  setLocation: (value: Location | null) => void
  namespace: string
  label?: string
  required?: boolean
  disabled?: boolean
}) {
  const { t } = useTranslation('common.misc')

  const apiHost = useAPIEndpoint()

  const [query, setQuery] = useState('')

  const debouncedQuery = useDebounce(query, 500)

  const [enabled, setEnabled] = useState<'loading' | boolean>('loading')

  const dataQuery = useAPIQuery<Location[]>(
    `/locations?q=${debouncedQuery}`,
    [debouncedQuery],
    debouncedQuery.trim() !== ''
  )

  useEffect(() => {
    if (query.trim() === '') {
      dataQuery.refetch()
    }
  }, [query])

  useEffect(() => {
    fetchAPI<boolean>(apiHost, '/locations/enabled').then(enabled =>
      setEnabled(enabled)
    )
  }, [])

  return (
    <div className="relative flex w-full items-center gap-3">
      <ListboxOrComboboxInput<Location | null>
        className="w-full"
        customActive={(location?.name.length || 0) > 0}
        disabled={!enabled || disabled || enabled === 'loading'}
        displayValue={value => value?.name ?? ''}
        icon="tabler:map-pin"
        name={label || 'Location'}
        namespace={namespace}
        required={required}
        setQuery={setQuery}
        setValue={setLocation}
        type="combobox"
        value={location}
      >
        {query.trim() !== '' &&
          (dataQuery.data ? (
            <>
              {dataQuery.data.map(loc => (
                <ListboxOrComboboxOption
                  key={JSON.stringify(loc.location)}
                  text={
                    <div className="w-full min-w-0">
                      {loc.name}
                      <p className="text-bg-400 dark:text-bg-600 w-full min-w-0 truncate text-sm">
                        {loc.formattedAddress}
                      </p>
                    </div>
                  }
                  type="combobox"
                  value={loc}
                />
              ))}
            </>
          ) : (
            <div className="flex-center my-6">
              <Icon
                className="text-bg-500 h-6 w-6"
                icon="svg-spinners:180-ring"
              />
            </div>
          ))}
      </ListboxOrComboboxInput>
      {enabled === 'loading' ? (
        <Icon
          className="text-bg-500 absolute top-1/2 right-6 h-6 w-6 -translate-y-1/2"
          icon="svg-spinners:180-ring"
        />
      ) : (
        !enabled && (
          <div className="flex-center text-bg-500 absolute top-1/2 right-6 -translate-y-1/2 gap-2">
            {t('locationDisabled.title')}
            <Tooltip
              icon="tabler:info-circle"
              id="location-disabled"
              tooltipProps={{
                positionStrategy: 'fixed',
                clickable: true,
                place: 'top-end'
              }}
            >
              <p className="text-bg-500 max-w-64">
                {t('locationDisabled.description')}{' '}
                <a
                  className="text-custom-500 decoration-custom-500 font-medium underline decoration-2"
                  href="https://docs.lifeforge.melvinchia.dev/user-guide/api-keys#location"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  API Keys Guide
                </a>
              </p>
            </Tooltip>
          </div>
        )
      )}
    </div>
  )
}

export default LocationInput
