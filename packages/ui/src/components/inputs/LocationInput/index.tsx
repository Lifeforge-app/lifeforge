import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { useState } from 'react'

import { useAPIEndpoint } from '@lifeforge/shared'

import { ComboboxInput, ComboboxOption } from '@/components/inputs'
import type { InputVariants } from '@/components/inputs/shared/types'
import { Box, Flex, Icon, Text } from '@/components/primitives'
import { forgeAPI } from '@/utils/forgeAPI'

import { useInputLabel } from '../shared/hooks/useInputLabel'
import { LocationActionButton } from './components/LocationActionButton'

export type Location = {
  name: string
  formattedAddress: string
  location: { latitude: number; longitude: number }
}

interface LocationInputProps {
  label?: string
  icon?: string
  value: Location | null
  onChange: (value: Location | null) => void
  required?: boolean
  disabled?: boolean
  autoFocus?: boolean
  className?: string
  namespace?: string
  errorMsg?: string
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
  variant = 'classic'
}: LocationInputProps & InputVariants) {
  const inputLabel = useInputLabel({ namespace, label: label ?? '' })

  const apiHost = useAPIEndpoint()

  const [query, setQuery] = useState('')

  const debouncedQuery = useDebounce(query, 500)

  const enabledQuery = useQuery(
    forgeAPI
      .untyped('/apiKeys/entries/checkKeys')
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
    forgeAPI
      .untyped('/locations/search')
      .setHost(apiHost)
      .input({
        q: debouncedQuery
      })
      .queryOptions({
        enabled: debouncedQuery.trim() !== '' && enabledQuery.data === true
      })
  )

  return (
    <Flex align="start" gap="md">
      <Box width="100%">
        <ComboboxInput<Location | null>
          autoFocus={autoFocus}
          className={className}
          disabled={!enabled || disabled || enabled === 'loading'}
          displayValue={value => value?.name ?? ''}
          errorMsg={errorMsg}
          forcedActiveWhen={(value?.name?.length || 0) > 0}
          icon={icon}
          label={inputLabel}
          namespace={namespace}
          required={required}
          value={value}
          variant={variant}
          onChange={location => {
            onChange(location ?? null)
          }}
          onQueryChanged={setQuery}
        >
          {query.trim() !== '' &&
            (dataQuery.data ? (
              <>
                {dataQuery.data.map((loc: Location) => (
                  <ComboboxOption
                    key={JSON.stringify(loc.location)}
                    label={
                      <Box minWidth="0" width="100%">
                        <Text truncate>{loc.name}</Text>
                        <Text
                          truncate
                          as="div"
                          color={{ base: 'bg-400', dark: 'bg-600' }}
                        >
                          {loc.formattedAddress}
                        </Text>
                      </Box>
                    }
                    value={loc}
                  />
                ))}
              </>
            ) : (
              <Flex align="center" justify="center" my="3xl">
                <Icon
                  color={{ base: 'bg-500' }}
                  icon="svg-spinners:ring-resize"
                  size="1.5rem"
                />
              </Flex>
            ))}
        </ComboboxInput>
      </Box>
      <Box
        mr={variant === 'classic' ? 'lg' : 'md'}
        mt="lg"
        style={{ pointerEvents: 'all' }}
      >
        <LocationActionButton enabled={enabled} />
      </Box>
    </Flex>
  )
}
