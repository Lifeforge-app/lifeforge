import { Button, ViewImageModal, useModalStore } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import { useTransactionDetails } from '../TransactionDetailsContext'
import DetailItem from './DetailItem'

function ReceiptSection() {
  const transaction = useTransactionDetails()
  const { open } = useModalStore()

  if (!transaction.receipt) return null

  return (
    <DetailItem vertical icon="tabler:receipt" label="receipt">
      <Button
        icon="tabler:eye"
        variant="secondary"
        width="100%"
        onClick={() => {
          open(ViewImageModal, {
            src: forgeAPI.getMedia({
              collectionId: transaction.collectionId,
              recordId: transaction.id,
              fieldId: transaction.receipt || ''
            })
          })
        }}
      >
        View Receipt
      </Button>
    </DetailItem>
  )
}

export default ReceiptSection
