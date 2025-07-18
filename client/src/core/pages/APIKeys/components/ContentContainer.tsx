import { useQuery } from '@tanstack/react-query'
import { EmptyStateScreen, QueryWrapper } from 'lifeforge-ui'

import { fetchAPI } from 'shared/lib'

import CreatePasswordScreen from '@security/components/CreatePasswordScreen'
import LockedScreen from '@security/components/LockedScreen'
import OTPScreen from '@security/components/OTPScreen'
import { encrypt } from '@security/utils/encryption'

import { useAuth } from '../../../providers/AuthProvider'
import { IAPIKeyEntry } from '../interfaces/api_keys_interfaces'
import EntryItem from './EntryItem'

function ContentContainer({
  masterPassword,
  setMasterPassword,
  otpSuccess,
  setOtpSuccess
}: {
  masterPassword: string
  setMasterPassword: React.Dispatch<React.SetStateAction<string>>
  otpSuccess: boolean
  setOtpSuccess: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { userData } = useAuth()
  const entriesQuery = useQuery<IAPIKeyEntry[]>({
    queryKey: ['api-keys', 'entries', masterPassword],
    queryFn: async () => {
      const challenge = await fetchAPI<string>(
        import.meta.env.VITE_API_URL,
        'api-keys/auth/challenge'
      )

      return fetchAPI(
        import.meta.env.VITE_API_URL,
        'api-keys/entries?master=' +
          encodeURIComponent(encrypt(masterPassword, challenge))
      )
    },
    enabled: !!masterPassword
  })

  if (!otpSuccess) {
    return (
      <OTPScreen
        callback={() => {
          setOtpSuccess(true)
        }}
        endpoint="api-keys/auth"
      />
    )
  }

  if (userData?.hasAPIKeysMasterPassword === false) {
    return <CreatePasswordScreen endpoint="api-keys/auth" />
  }

  if (masterPassword === '') {
    return (
      <LockedScreen
        endpoint="api-keys/auth"
        setMasterPassword={setMasterPassword}
      />
    )
  }

  return (
    <>
      <QueryWrapper query={entriesQuery}>
        {entries => (
          <div className="mb-24 flex-1 lg:mb-12">
            {entries.length > 0 ? (
              entries.map((entry, idx) => (
                <EntryItem
                  key={entry.id}
                  entry={entry}
                  hasDivider={idx !== entries.length - 1}
                  masterPassword={masterPassword}
                />
              ))
            ) : (
              <EmptyStateScreen
                icon="tabler:key-off"
                name="apiKeys"
                namespace="core.apiKeys"
              />
            )}
          </div>
        )}
      </QueryWrapper>
    </>
  )
}

export default ContentContainer
