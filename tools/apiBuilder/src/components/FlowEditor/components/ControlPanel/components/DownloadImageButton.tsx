import { getViewportForBounds, useNodes } from '@xyflow/react'
import { toPng } from 'html-to-image'
import { Button } from 'lifeforge-ui'
import { usePersonalization } from 'shared'

import {
  getAbsolutePosition,
  getNodeBounds
} from '../../../utils/getNodeBounds'

const MARGIN = 100

function downloadImage(dataUrl: string) {
  const a = document.createElement('a')

  a.setAttribute('download', 'forgeflow.png')
  a.setAttribute('href', dataUrl)
  a.click()
}

function DownloadImageButton() {
  const { derivedTheme, bgTempPalette } = usePersonalization()

  const nodes = useNodes()

  const onClick = () => {
    const nodesBounds = getNodeBounds(
      nodes.map(node => ({
        ...node,
        position: getAbsolutePosition(nodes, node)
      }))
    )

    nodesBounds.x -= MARGIN
    nodesBounds.y -= MARGIN
    nodesBounds.width += MARGIN * 2
    nodesBounds.height += MARGIN * 2

    const viewportElement = document.querySelector(
      '.react-flow__viewport'
    ) as HTMLElement

    const viewport = getViewportForBounds(
      nodesBounds,
      nodesBounds.width,
      nodesBounds.height,
      1,
      1,
      0
    )

    toPng(viewportElement, {
      backgroundColor:
        derivedTheme === 'dark' ? bgTempPalette[950] : bgTempPalette[100],
      width: nodesBounds.width,
      height: nodesBounds.height,
      style: {
        width: nodesBounds.width + 'px',
        height: nodesBounds.height + 'px',
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`
      },
      skipFonts: true
    }).then(downloadImage)
  }

  return <Button icon="tabler:photo" variant="plain" onClick={onClick} />
}

export default DownloadImageButton
