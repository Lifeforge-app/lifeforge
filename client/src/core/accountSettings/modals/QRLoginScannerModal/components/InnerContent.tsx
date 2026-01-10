import useQRLoginApproval from '../hooks/useQRLoginApproval'
import ConfirmScreen from './ConfirmScreen'
import ErrorScreen from './ErrorScreen'
import SuccessScreen from './SuccessScreen'

function InnerContent({
  onClose,
  scannedData
}: {
  onClose: () => void
  scannedData: string
}) {
  const { step, browserInfo, errorMessage, loading, onApprove } =
    useQRLoginApproval(scannedData)

  switch (step) {
    case 'confirm':
      return (
        <ConfirmScreen
          loading={loading}
          onApprove={onApprove}
          onClose={onClose}
        />
      )
    case 'success':
      return <SuccessScreen browserInfo={browserInfo} onClose={onClose} />
    case 'error':
      return <ErrorScreen errorMessage={errorMessage} onClose={onClose} />
    default:
      return null
  }
}

export default InnerContent
