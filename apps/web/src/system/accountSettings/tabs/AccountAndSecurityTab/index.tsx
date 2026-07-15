import OAuthConfigColumn from './columns/OAuthConfigColumn'
import PasswordColumn from './columns/PasswordColumn'
import QRLoginColumn from './columns/QRLoginColumn'
import TwoFAColumn from './columns/TwoFAColumn'

function AccountAndSecurityTab() {
  return (
    <>
      <PasswordColumn />
      <OAuthConfigColumn />
      <TwoFAColumn />
      <QRLoginColumn />
    </>
  )
}

export default AccountAndSecurityTab
