import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useState } from 'react'

import { forgeAPI } from '@/manifest'
import { unwrapVEK } from '@/utils/vek'

const VEKContext = createContext<CryptoKey | null>(null)

export function useVEKContext() {
  return useContext(VEKContext)
}

export function VEKProvider({
  masterPassword,
  children
}: {
  masterPassword: string
  children: React.ReactNode
}) {
  const [vek, setVEK] = useState<CryptoKey | null>(null)

  const wrappedVEKQuery = useQuery(
    forgeAPI.master.getWrappedVEK.queryOptions({
      enabled: masterPassword !== ''
    })
  )

  useEffect(() => {
    const wrappedVEK = wrappedVEKQuery.data?.wrapped_vek

    if (!masterPassword || !wrappedVEK) return

    unwrapVEK(wrappedVEK, masterPassword)
      .then(setVEK)
      .catch(() => setVEK(null))
  }, [masterPassword, wrappedVEKQuery.data?.wrapped_vek])

  return <VEKContext.Provider value={vek}>{children}</VEKContext.Provider>
}
