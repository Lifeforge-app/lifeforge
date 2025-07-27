import CreatePasswordScreen from '@security/components/CreatePasswordScreen'
import LockedScreen from '@security/components/LockedScreen'
import OTPScreen from '@security/components/OTPScreen'
import { encrypt } from '@security/utils/encryption'
import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import type { InferOutput } from 'lifeforge-api'
import { EmptyStateScreen, QueryWrapper } from 'lifeforge-ui'

import { useAuth } from '../../../providers/AuthProvider'
import EntryItem from './EntryItem'

export type APIKeysEntry = InferOutput<
  typeof forgeAPI.apiKeys.entries.list
>[number]

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

  const challengeQuery = useQuery(
    forgeAPI.apiKeys.auth.getChallenge.queryOptions()
  )

  const entriesQuery = useQuery(
    forgeAPI.apiKeys.entries.list
      .input({
        master: encrypt(masterPassword, challengeQuery.data || '')
      })
      .queryOptions({
        enabled: !!masterPassword && otpSuccess && challengeQuery.isSuccess
      })
  )

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
