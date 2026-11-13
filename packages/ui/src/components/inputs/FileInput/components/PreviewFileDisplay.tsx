import Zoom from 'react-medium-image-zoom'

import { Button } from '@/components/inputs'
import { Box } from '@/components/primitives'

import type { FileValue } from '..'

export function PreviewFileDisplay({
  previewUrl,
  onChange
}: {
  previewUrl: string
  onChange: (value: FileValue) => void
}) {
  return (
    <Box mt="lg">
      <Zoom zoomMargin={100}>
        <Box asChild maxHeight="24em" r="md">
          <img key={previewUrl} alt="" src={previewUrl} />
        </Box>
      </Zoom>
      <Button
        dangerous
        icon="tabler:x"
        style={{ marginTop: '1.5em', width: '100%' }}
        onClick={() => onChange({ type: 'empty' })}
      >
        Remove
      </Button>
    </Box>
  )
}
