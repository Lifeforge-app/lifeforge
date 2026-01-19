import { createContext, useContext, useMemo, useRef, useState } from 'react'

import type { ModuleCategory } from '..'

export const SYSTEM_CATEGORIES = [
  '<START>',
  'Miscellaneous',
  'Settings',
  'SSO',
  '<END>'
]

interface FederationContextValue {
  modules: ModuleCategory[]
  setModules: React.Dispatch<React.SetStateAction<ModuleCategory[]>>
  globalProviders: React.FC<{ children: React.ReactNode }>[]
  setGlobalProviders: React.Dispatch<
    React.SetStateAction<React.FC<{ children: React.ReactNode }>[]>
  >
  categoryTranslations: Record<string, Record<string, string>>
  setCategoryTranslations: React.Dispatch<
    React.SetStateAction<Record<string, Record<string, string>>>
  >
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  error: Error | null
  setError: React.Dispatch<React.SetStateAction<Error | null>>
  refetch: React.RefObject<() => Promise<void>>
}

const defaultValue: FederationContextValue = {
  modules: [],
  setModules: () => {},
  globalProviders: [],
  setGlobalProviders: () => {},
  categoryTranslations: {},
  setCategoryTranslations: () => {},
  loading: true,
  setLoading: () => {},
  error: null,
  setError: () => {},
  refetch: { current: async () => {} }
}

const FederationContext = createContext<FederationContextValue>(defaultValue)

export function useFederation(): FederationContextValue {
  return useContext(FederationContext)
}

function FederationProvider({ children }: { children: React.ReactNode }) {
  const [modules, setModules] = useState<ModuleCategory[]>([])

  const [globalProviders, setGlobalProviders] = useState<
    React.FC<{ children: React.ReactNode }>[]
  >([])

  const [categoryTranslations, setCategoryTranslations] = useState<
    Record<string, Record<string, string>>
  >({})

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState<Error | null>(null)

  const refetch = useRef<() => Promise<void>>(async () => {})

  const value = useMemo(
    () => ({
      modules,
      setModules,
      globalProviders,
      setGlobalProviders,
      categoryTranslations,
      setCategoryTranslations,
      loading,
      setLoading,
      error,
      setError,
      refetch
    }),
    [modules, globalProviders, categoryTranslations, loading, error]
  )

  return <FederationContext value={value}>{children}</FederationContext>
}

export default FederationProvider
