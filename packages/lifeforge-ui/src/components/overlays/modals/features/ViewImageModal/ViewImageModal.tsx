import { Box, Flex } from '@components/primitives'

import ModalHeader from '../../core/components/ModalHeader'

function ViewImageModal({
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
      <Flex justify="center" style={{ minWidth: '24rem' }}>
        {src !== '' && <img key={src} alt="" src={src} />}
      </Flex>
    </Box>
  )
}

export default ViewImageModal
