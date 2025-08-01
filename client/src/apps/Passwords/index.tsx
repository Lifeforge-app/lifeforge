import { Button, ModuleHeader, ModuleWrapper } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { usePasswordContext } from '@apps/Passwords/providers/PasswordsProvider'

import ContentContainer from './components/ContentContainer'
import ModifyPasswordModal from './modals/ModifyPasswordModal'

function Passwords() {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.passwords')

  const { masterPassword, otpSuccess } = usePasswordContext()

  const handleCreatePassword = useCallback(() => {
    open(ModifyPasswordModal, {
      type: 'create'
    })
  }, [])

  return (
    <ModuleWrapper>
      <ModuleHeader
        actionButton={
          otpSuccess &&
          masterPassword !== '' && (
            <Button
              className="hidden lg:flex"
              icon="tabler:plus"
              tProps={{ item: t('items.password') }}
              onClick={handleCreatePassword}
            >
              new
            </Button>
          )
        }
        icon="tabler:key"
        title="Passwords"
      />
      <ContentContainer />
    </ModuleWrapper>
  )
}

export default Passwords
