import React from 'react'
import Zoom from 'react-medium-image-zoom'

function ReceiptColumn({
  collectionId,
  id,
  receipt
}: {
  collectionId: string
  id: string
  receipt: string
}): React.ReactElement {
  return (
    <td className="p-2 text-center">
      {receipt !== '' ? (
        <Zoom zoomMargin={100}>
          <img
            alt=""
            className={
              'mx-auto size-12 rounded-lg bg-bg-200 object-cover dark:bg-bg-800'
            }
            src={`${
              import.meta.env.VITE_API_HOST
            }/media/${collectionId}/${id}/${receipt}`}
          />
        </Zoom>
      ) : (
        '-'
      )}
    </td>
  )
}

export default ReceiptColumn
