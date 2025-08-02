import { createContext, useContext, useState } from 'react'

const LocaleManagerContext = createContext<
  | {
      namespace: 'common' | 'core' | 'apps' | 'utils' | null
      subNamespace: string | null
      setNamespace: React.Dispatch<
        React.SetStateAction<'common' | 'core' | 'apps' | 'utils' | null>
      >
      setSubNamespace: React.Dispatch<React.SetStateAction<string | null>>
    }
  | undefined
>(undefined)

export default function LocaleManagerProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [namespace, setNamespace] = useState<
    'common' | 'core' | 'apps' | 'utils' | null
  >(null)

  const [subNamespace, setSubNamespace] = useState<string | null>(null)

  return (
    <LocaleManagerContext.Provider
      value={{ namespace, subNamespace, setNamespace, setSubNamespace }}
    >
      {children}
    </LocaleManagerContext.Provider>
  )
}

export const useLocaleManager = () => {
  const context = useContext(LocaleManagerContext)

  if (!context) {
    throw new Error(
      'useLocaleManager must be used within a LocaleManagerProvider'
    )
  }

  return context
}
