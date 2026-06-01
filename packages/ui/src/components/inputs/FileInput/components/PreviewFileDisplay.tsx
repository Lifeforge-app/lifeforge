import Zoom from 'react-medium-image-zoom'

import { Button } from '@/components/inputs'
import { Box } from '@/components/primitives'

import type { FileValue } from '..'

export function PreviewFileDisplay({
  previewUrl,
  onChange,
  onImageRemoved
}: {
  previewUrl: string
  onChange: (value: FileValue) => void
  onImageRemoved?: () => void
}) {
  return (
    <Box mt="lg">
      <Zoom zoomMargin={100}>
        <Box asChild maxHeight="24rem" r="md">
          <img alt="" src={previewUrl} />
        </Box>
      </Zoom>
      <Button
        dangerous
        icon="tabler:x"
        style={{ marginTop: '1.5rem', width: '100%' }}
        onClick={function () {
          onChange({ type: 'empty' })
          onImageRemoved?.()
        }}
      >
        Remove
      </Button>
    </Box>
  )
}
