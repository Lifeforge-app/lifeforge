import { Button, useModalStore } from 'lifeforge-ui'

import ViewReceiptModal from '../../../ListView/components/ViewReceiptModal'

function ReceiptColumn({
  collectionId,
  id,
  receipt
}: {
  collectionId: string
  id: string
  receipt: string
}) {
  const open = useModalStore(state => state.open)

  return (
    <td className="p-2 text-center">
      {receipt !== '' ? (
        <Button
          icon="tabler:eye"
          variant="plain"
          onClick={() => {
            open(ViewReceiptModal, {
              src: `${
                import.meta.env.VITE_API_HOST
              }/media/${collectionId}/${id}/${receipt}`
            })
          }}
        />
      ) : (
        <></>
      )}
    </td>
  )
}

export default ReceiptColumn
