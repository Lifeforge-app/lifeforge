import { ModalHeader, ModalWrapper } from '@lifeforge/ui'

function ModifyCardModal({
  openType,
  setOpenType
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
}) {
  return (
    <ModalWrapper isOpen={openType !== null} minHeight="70vh" minWidth="60vw">
      <ModalHeader
        icon="tabler:cards"
        title={openType === 'create' ? 'Create Card' : 'Update Card'}
        onClose={() => {
          setOpenType(null)
        }}
      />
    </ModalWrapper>
  )
}

export default ModifyCardModal
