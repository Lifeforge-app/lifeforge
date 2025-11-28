import forgeAPI from '@/utils/forgeAPI'
import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAPIEndpoint } from 'shared'

import { ComboboxInput, ComboboxOption } from '@components/controls'

import { Tooltip } from '../utilities'

export type Location = {
  name: string
  formattedAddress: string
  location: { latitude: number; longitude: number }
}

interface LocationInputProps {
  /** The label text displayed above the location input field. */
  label?: string
  /** The current location value of the input. */
  value: Location | null
  /** Callback function called when the location value changes. */
  onChange: (value: Location | null) => void
  /** Whether the location field is required for form validation. */
  required?: boolean
  /** Whether the location input is disabled and non-interactive. */
  disabled?: boolean
  /** Whether the input should automatically focus when rendered. */
  autoFocus?: boolean
  /** The i18n namespace for internationalization. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details. */
  namespace?: string
}

function LocationInput({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  autoFocus = false,
  namespace
}: LocationInputProps) {
  const { t } = useTranslation('common.misc')

  const apiHost = useAPIEndpoint()

  const [query, setQuery] = useState('')

  const debouncedQuery = useDebounce(query, 500)

  const enabledQuery = useQuery(
    forgeAPI.apiKeys.entries.checkKeys
      .setHost(apiHost)
      .input({
        keys: 'gcloud'
      })
      .queryOptions()
  )

  const enabled =
    typeof enabledQuery.data === 'boolean'
      ? enabledQuery.data
      : enabledQuery.isLoading
        ? 'loading'
        : false

  const dataQuery = useQuery(
    forgeAPI.locations.search
      .setHost(apiHost)
      .input({
        q: debouncedQuery
      })
      .queryOptions({
        enabled: debouncedQuery.trim() !== '' && enabledQuery.data === true
      })
  )

  return (
    <div className="relative flex w-full items-center gap-3">
      <ComboboxInput<Location | null>
        autoFocus={autoFocus}
        className="w-full"
        disabled={!enabled || disabled || enabled === 'loading'}
        displayValue={value => value?.name ?? ''}
        forcedActiveWhen={(value?.name?.length || 0) > 0}
        icon="tabler:map-pin"
        label={label || 'Location'}
        namespace={namespace}
        required={required}
        value={value}
        onChange={location => {
          onChange(location ?? null)
        }}
        onQueryChanged={setQuery}
      >
        {query.trim() !== '' &&
          (dataQuery.data ? (
            <>
              {dataQuery.data.map(loc => (
                <ComboboxOption
                  key={JSON.stringify(loc.location)}
                  label={
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
                icon="svg-spinners:ring-resize"
              />
            </div>
          ))}
      </ComboboxInput>
      {enabled === 'loading' ? (
        <Icon
          className="text-bg-500 absolute top-1/2 right-6 h-6 w-6 -translate-y-1/2"
          icon="svg-spinners:ring-resize"
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
