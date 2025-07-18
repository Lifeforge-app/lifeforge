import { UseQueryResult } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { createContext, useContext, useMemo, useState } from 'react'
import { Outlet } from 'react-router'

import { useAPIQuery } from 'shared/lib'

import { IPasswordEntry } from '@apps/Passwords/interfaces/password_interfaces'

interface IPasswordsData {
  passwordListQuery: UseQueryResult<IPasswordEntry[]>
  filteredPasswordList: IPasswordEntry[]

  otpSuccess: boolean
  masterPassword: string
  query: string

  setOtpSuccess: React.Dispatch<React.SetStateAction<boolean>>
  setMasterPassword: React.Dispatch<React.SetStateAction<string>>
  setQuery: React.Dispatch<React.SetStateAction<string>>
}

export const PasswordsContext = createContext<IPasswordsData | undefined>(
  undefined
)

export default function PasswordsProvider() {
  const [otpSuccess, setOtpSuccess] = useState(false)

  const [masterPassword, setMasterPassword] = useState('')

  const [query, setQuery] = useState('')

  const debouncedQuery = useDebounce(query, 300)

  const passwordListQuery = useAPIQuery<IPasswordEntry[]>(
    'passwords/entries',
    ['passwords', 'entries'],
    masterPassword !== ''
  )

  const filteredPasswordList = useMemo(() => {
    const passwordList = passwordListQuery.data

    if (!passwordList) {
      return []
    }

    if (debouncedQuery === '') {
      return passwordList
    }

    return passwordList.filter(
      password =>
        password.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        password.website.toLowerCase().includes(debouncedQuery.toLowerCase())
    )
  }, [debouncedQuery, passwordListQuery.data])

  const value = useMemo(
    () => ({
      passwordListQuery,
      filteredPasswordList,

      otpSuccess,
      masterPassword,
      query,

      setOtpSuccess,
      setMasterPassword,
      setQuery
    }),
    [passwordListQuery, filteredPasswordList, otpSuccess, masterPassword, query]
  )

  return (
    <PasswordsContext value={value}>
      <Outlet />
    </PasswordsContext>
  )
}

export function usePasswordContext(): IPasswordsData {
  const context = useContext(PasswordsContext)

  if (context === undefined) {
    throw new Error(
      'usePasswordContext must be used within a PasswordsProvider'
    )
  }

  return context
}
