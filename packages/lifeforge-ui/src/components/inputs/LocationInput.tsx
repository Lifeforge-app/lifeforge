import { ComboboxInput, ComboboxOption } from '@components/inputs'
import type { Location } from '@components/modals/features/FormModal/typescript/form_interfaces'
import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAPIEndpoint } from 'shared'

import forgeAPI from '../../utils/forgeAPI'
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
  namespace: string | false
  label?: string
  required?: boolean
  disabled?: boolean
}) {
  const { t } = useTranslation('common.misc')

  const apiHost = useAPIEndpoint()

  const [query, setQuery] = useState('')

  const debouncedQuery = useDebounce(query, 500)

  const [enabled, setEnabled] = useState<'loading' | boolean>('loading')

  const dataQuery = useQuery(
    forgeAPI.locations.search
      .setHost(apiHost)
      .input({
        q: debouncedQuery
      })
      .queryOptions({
        enabled: debouncedQuery.trim() !== ''
      })
  )

  useEffect(() => {
    if (query.trim() === '') {
      dataQuery.refetch()
    }
  }, [query])

  useEffect(() => {
    forgeAPI.locations.verifyAPIKey
      .setHost(apiHost)
      .query()
      .then(enabled => setEnabled(enabled))
  }, [])

  return (
    <div className="relative flex w-full items-center gap-3">
      <ComboboxInput<Location | null>
        className="w-full"
        customActive={(location?.name?.length || 0) > 0}
        disabled={!enabled || disabled || enabled === 'loading'}
        displayValue={value => value?.name ?? ''}
        icon="tabler:map-pin"
        name={label || 'Location'}
        namespace={namespace}
        required={required}
        setQuery={setQuery}
        setValue={location => {
          setLocation(location ?? null)
        }}
        value={location}
      >
        {query.trim() !== '' &&
          (dataQuery.data ? (
            <>
              {dataQuery.data.map(loc => (
                <ComboboxOption
                  key={JSON.stringify(loc.location)}
                  text={
                    <div className="w-full min-w-0">
                      {loc.name}
                      <p className="text-bg-400 dark:text-bg-600 w-full min-w-0 truncate text-sm">
                        {loc.formattedAddress}
                      </p>
                    </div>
                  }
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
      </ComboboxInput>
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
