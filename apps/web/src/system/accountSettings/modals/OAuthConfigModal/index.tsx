import { ModalHeader, Stack, WithQueryData } from '@lifeforge/ui'

import forgeAPI from '@/core/utils/forgeAPI'

import ProviderItem from './components/ProviderItem'

function OAuthConfigModal({ onClose }: { onClose: () => void }) {
  return (
    <Stack minWidth="40vw">
      <ModalHeader
        icon="tabler:login"
        namespace="common.account-settings"
        title="oauthConfig"
        onClose={onClose}
      />
      <WithQueryData contract={forgeAPI.auth.oauth.providers.listOptions}>
        {data => (
          <>
            {data.map(entry => (
              <ProviderItem key={entry.provider} entry={entry} />
            ))}
          </>
        )}
      </WithQueryData>
    </Stack>
  )
}

export default OAuthConfigModal
