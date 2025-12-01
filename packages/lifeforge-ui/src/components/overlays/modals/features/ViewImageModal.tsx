import ModalHeader from '../core/components/ModalHeader'

function ViewImageModal({
  data: { src },
  onClose
}: {
  data: { src: string }
  onClose: () => void
}) {
  return (
    <div>
      <ModalHeader
        icon="tabler:photo"
        namespace="common.modals"
        title="viewImage"
        onClose={onClose}
      />
      <div className="flex w-full justify-center sm:min-w-96">
        {src !== '' && <img key={src} alt="" src={src} />}
      </div>
    </div>
  )
}

export default ViewImageModal
