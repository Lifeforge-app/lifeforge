import { IPasswordEntry } from '@apps/Passwords/interfaces/password_interfaces'
import { UseQueryResult } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { createContext, useContext, useMemo, useState } from 'react'
import { Outlet } from 'react-router'

import useAPIQuery from '@hooks/useAPIQuery'

interface IPasswordsData {
  passwordListQuery: UseQueryResult<IPasswordEntry[]>
  filteredPasswordList: IPasswordEntry[]

  otpSuccess: boolean
  masterPassword: string
  modifyPasswordModalOpenType: 'create' | 'update' | null
  query: string
  isDeletePasswordConfirmationModalOpen: boolean
  existedData: IPasswordEntry | null

  setOtpSuccess: React.Dispatch<React.SetStateAction<boolean>>
  setMasterPassword: React.Dispatch<React.SetStateAction<string>>
  setModifyPasswordModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setQuery: React.Dispatch<React.SetStateAction<string>>
  setIsDeletePasswordConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
  setExistedData: React.Dispatch<React.SetStateAction<IPasswordEntry | null>>
}

export const PasswordsContext = createContext<IPasswordsData | undefined>(
  undefined
)

export default function PasswordsProvider() {
  const [otpSuccess, setOtpSuccess] = useState(true)
  const [masterPassword, setMasterPassword] = useState('')
  const [modifyPasswordModalOpenType, setModifyPasswordModalOpenType] =
    useState<'create' | 'update' | null>(null)
  const [query, setQuery] = useState('')
  const [
    isDeletePasswordConfirmationModalOpen,
    setIsDeletePasswordConfirmationModalOpen
  ] = useState(false)
  const [existedData, setExistedData] = useState<IPasswordEntry | null>(null)
  const debouncedQuery = useDebounce(query, 500)
  const passwordListQuery = useAPIQuery<IPasswordEntry[]>(
    'passwords/password',
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
      modifyPasswordModalOpenType,
      query,
      isDeletePasswordConfirmationModalOpen,
      existedData,

      setOtpSuccess,
      setMasterPassword,
      setModifyPasswordModalOpenType,
      setQuery,
      setIsDeletePasswordConfirmationModalOpen,
      setExistedData
    }),
    [
      passwordListQuery,
      filteredPasswordList,

      otpSuccess,
      masterPassword,
      modifyPasswordModalOpenType,
      query,
      isDeletePasswordConfirmationModalOpen,
      existedData
    ]
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
