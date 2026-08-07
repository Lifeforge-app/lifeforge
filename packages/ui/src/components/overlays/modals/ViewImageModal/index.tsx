import { Box } from '@/components/primitives'

import { ModalHeader } from '../ModalHeader'

export function ViewImageModal({
  data: { src },
  onClose
}: {
  data: { src: string }
  onClose: () => void
}) {
  return (
    <Box>
      <ModalHeader
        icon="tabler:photo"
        namespace="common.modals"
        title="viewImage"
        onClose={onClose}
      />
      <Box asChild r="md">
        {src !== '' && <img key={src} alt="" src={src} />}
      </Box>
    </Box>
  )
}
