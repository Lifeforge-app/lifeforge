import { useDebounce } from '@uidotdev/usehooks'
import { createContext, useContext, useMemo, useState } from 'react'
import { Outlet } from 'react-router'

import { IPasswordEntry } from '@modules/Passwords/interfaces/password_interfaces'

import useFetch from '@hooks/useFetch'

import { Loadable } from '../../../core/interfaces/common'

interface IPasswordsData {
  passwordList: Loadable<IPasswordEntry[]>
  filteredPasswordList: Loadable<IPasswordEntry[]>
  refreshPasswordList: () => void
  setPasswordList: React.Dispatch<
    React.SetStateAction<Loadable<IPasswordEntry[]>>
  >

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
  const [otpSuccess, setOtpSuccess] = useState(false)
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
  const [passwordList, refreshPasswordList, setPasswordList] = useFetch<
    IPasswordEntry[]
  >('passwords/password', masterPassword !== '')

  const filteredPasswordList = useMemo(() => {
    if (debouncedQuery === '' || typeof passwordList === 'string') {
      return passwordList
    }
    return passwordList.filter(
      password =>
        password.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        password.website.toLowerCase().includes(debouncedQuery.toLowerCase())
    )
  }, [debouncedQuery, passwordList])

  const value = useMemo(
    () => ({
      passwordList,
      filteredPasswordList,
      refreshPasswordList,
      setPasswordList,

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
      passwordList,
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
    throw new Error('useIdeaBoxContext must be used within a IdeaBoxProvider')
  }
  return context
}
