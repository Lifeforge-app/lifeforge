import { parseAsStringEnum, useQueryState } from 'nuqs'
import { useMemo, useState } from 'react'

function useNuqsOrBasicState<TValue extends string>({
  options,
  defaultValue,
  useNuqs,
  controlled
}: {
  options: TValue[]
  defaultValue?: TValue
  useNuqs: false | string
  controlled: {
    value: TValue | null
    setValue: ((value: TValue) => void) | null
  }
}) {
  const parser = useMemo(
    () => parseAsStringEnum(options).withDefault(defaultValue || options[0]),
    [defaultValue, ...options]
  )

  const [nuqsState, setNuqsState] = useQueryState(
    useNuqs || '',
    parser
  )

  const [basicState, setBasicState] = useState(defaultValue || options[0])

  const finalValue =
    controlled.value !== null
      ? controlled.value
      : useNuqs !== false
        ? nuqsState
        : basicState

  const finalSetValue =
    controlled.setValue !== null
      ? controlled.setValue
      : useNuqs !== false
        ? (value: TValue) => setNuqsState(value)
        : setBasicState

  return [finalValue, finalSetValue] as [TValue, (value: TValue) => void]
}

export default useNuqsOrBasicState
