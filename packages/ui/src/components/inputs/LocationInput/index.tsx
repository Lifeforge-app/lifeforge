import { useState } from 'react'

import { useAPIEndpoint } from '@lifeforge/api'

import { WithQueryData } from '@/components/api'
import { ComboboxInput } from '@/components/inputs'
import type { InputVariants } from '@/components/inputs/shared/types'
import { Box, Flex } from '@/components/primitives'
import { forgeAPI } from '@/utils/forgeAPI'

import { LocationOptions } from './components/LocationOptions'
import { LocationServiceStatusIndicator } from './components/LocationServiceStatusIndicator'

export type Location = {
  name: string
  formattedAddress: string
  location: { latitude: number; longitude: number }
}

export interface LocationInputProps {
  label?: string
  icon?: string
  value: Location | null
  onChange: (value: Location | null) => void
  required?: boolean
  disabled?: boolean
  autoFocus?: boolean
  className?: string
  namespace?: string | false
  errorMsg?: string
  /** Callback function called when Enter is pressed. */
  onEnter?: () => void
}

export function LocationInput({
  label,
  icon = 'tabler:map-pin',
  value,
  onChange,
  required = false,
  disabled = false,
  autoFocus = false,
  className,
  namespace,
  errorMsg,
  variant = 'classic',
  onEnter
}: LocationInputProps & InputVariants) {
  const apiHost = useAPIEndpoint()
  const [query, setQuery] = useState('')

  return (
    <WithQueryData
      contract={forgeAPI.checkAPIKeys({ keys: 'gcloud' }).setHost(apiHost)}
    >
      {enabled => (
        <Flex align="center" gap="md">
          <Box width="100%">
            <ComboboxInput<Location | null>
              autoFocus={autoFocus}
              className={className}
              disabled={!enabled || disabled}
              displayValue={value => value?.name ?? ''}
              errorMsg={errorMsg}
              forcedActiveWhen={(value?.name?.length || 0) > 0}
              icon={icon}
              label={label}
              namespace={namespace}
              required={required}
              value={value}
              variant={variant}
              onChange={location => {
                onChange(location ?? null)
              }}
              onEnter={onEnter}
              onQueryChanged={setQuery}
            >
              {query.trim() !== '' && (
                <LocationOptions enabled={enabled} query={query} />
              )}
            </ComboboxInput>
          </Box>
          <LocationServiceStatusIndicator enabled={enabled} />
        </Flex>
      )}
    </WithQueryData>
  )
}
