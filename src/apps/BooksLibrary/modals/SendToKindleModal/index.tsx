import { ModalHeader } from '@lifeforge/ui'

import ContentContainer from './components/ContentContainer'

function SendToKindleModal({
  data: { bookId },
  onClose
}: {
  data: { bookId: string }
  onClose: () => void
}) {
  return (
    <div className="min-w-[50vw]">
      <ModalHeader
        icon="tabler:brand-amazon"
        namespace="apps.booksLibrary"
        title="Send to Kindle"
        onClose={onClose}
      />
      <ContentContainer bookId={bookId} onClose={onClose} />
    </div>
  )
}

export default SendToKindleModal
