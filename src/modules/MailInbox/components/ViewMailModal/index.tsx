import React, { useEffect } from 'react'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import MailAttachments from './components/MailAttachments'
import MailContent from './components/MailContent'
import MailHeader from './components/MailHeader'

function ViewMailModal({
  openFor,
  onClose,
  onSeen
}: {
  openFor: string | null
  onClose: () => void
  onSeen: () => void
}): React.ReactElement {
  const [mailContent] = useFetch<any>(`mail-inbox/${openFor}`, openFor !== null)

  useEffect(() => {
    if (typeof mailContent !== 'string') {
      onSeen()
    }
  }, [mailContent])

  return (
    <ModalWrapper isOpen={openFor !== null} minWidth="60vw">
      <ModalHeader title="View Mail" onClose={onClose} icon="tabler:mail" />
      <APIFallbackComponent data={mailContent}>
        {mail => (
          <>
            <MailHeader mail={mail} />
            <MailContent mail={mail} />
            <MailAttachments mail={mail} />
          </>
        )}
      </APIFallbackComponent>
    </ModalWrapper>
  )
}

export default ViewMailModal
