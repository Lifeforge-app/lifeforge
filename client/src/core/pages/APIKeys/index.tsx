import { Button, FAB, ModuleHeader, ModuleWrapper } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import ContentContainer from './components/ContentContainer'
import ModifyAPIKeyModal from './modals/ModifyAPIKeyModal'

function APIKeys() {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation(['common.buttons', 'core.apiKeys'])

  const [otpSuccess, setOtpSuccess] = useState(false)

  const [masterPassword, setMasterPassword] = useState<string>('')

  const handleCreateAPIKey = useCallback(async () => {
    open(ModifyAPIKeyModal, {
      type: 'create',
      masterPassword
    })
  }, [masterPassword])

  return (
    <ModuleWrapper>
      <div className="flex-between flex">
        <ModuleHeader
          actionButton={
            otpSuccess &&
            masterPassword !== '' && (
              <Button
                className="hidden lg:flex"
                icon="tabler:plus"
                tProps={{
                  item: t('core.apiKeys:items.apiKey')
                }}
                onClick={handleCreateAPIKey}
              >
                new
              </Button>
            )
          }
          icon="tabler:password"
          title="API Keys"
        />
      </div>
      <ContentContainer
        masterPassword={masterPassword}
        otpSuccess={otpSuccess}
        setMasterPassword={setMasterPassword}
        setOtpSuccess={setOtpSuccess}
      />
      {otpSuccess && masterPassword !== '' && (
        <FAB onClick={handleCreateAPIKey} />
      )}
    </ModuleWrapper>
  )
}

export default APIKeys
