import Zoom from 'react-medium-image-zoom'

function ReceiptColumn({
  collectionId,
  id,
  receipt
}: {
  collectionId: string
  id: string
  receipt: string
}) {
  return (
    <td className="p-2 text-center">
      {receipt !== '' ? (
        <Zoom zoomMargin={100}>
          <img
            alt=""
            className={
              'bg-bg-200 dark:bg-bg-800 mx-auto size-12 rounded-lg object-cover'
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
