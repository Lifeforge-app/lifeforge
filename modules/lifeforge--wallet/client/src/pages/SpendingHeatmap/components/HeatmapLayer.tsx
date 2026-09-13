/// <reference types="google.maps" />
import { useMap } from '@vis.gl/react-google-maps'
import { useEffect } from 'react'

export function HeatmapLayer({
  data,
  metric
}: {
  data: Array<{
    lat: number
    lng: number
    amount: number
    count: number
  }>
  metric: 'amount' | 'count'
}) {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    const maxWeight = Math.max(
      ...data.map(item => (metric === 'amount' ? item.amount : item.count)),
      1
    )

    let palette: Uint8ClampedArray

    const paletteCanvas = document.createElement('canvas')
    paletteCanvas.width = 1
    paletteCanvas.height = 256
    const paletteCtx = paletteCanvas.getContext('2d')

    if (paletteCtx) {
      const grad = paletteCtx.createLinearGradient(0, 0, 0, 256)
      grad.addColorStop(0.0, 'rgba(0, 0, 255, 0.0)')
      grad.addColorStop(0.2, 'rgba(0, 0, 255, 0.4)')
      grad.addColorStop(0.4, 'rgba(0, 255, 255, 0.6)')
      grad.addColorStop(0.6, 'rgba(0, 255, 0, 0.8)')
      grad.addColorStop(0.8, 'rgba(255, 255, 0, 0.9)')
      grad.addColorStop(1.0, 'rgba(255, 0, 0, 0.95)')
      paletteCtx.fillStyle = grad
      paletteCtx.fillRect(0, 0, 1, 256)
      palette = paletteCtx.getImageData(0, 0, 1, 256).data
    } else {
      palette = new Uint8ClampedArray(256 * 4)
    }

    class CanvasHeatmapOverlay extends google.maps.OverlayView {
      private canvas: HTMLCanvasElement

      constructor() {
        super()
        this.canvas = document.createElement('canvas')
        this.canvas.style.position = 'absolute'
        this.canvas.style.pointerEvents = 'none'
      }

      onAdd() {
        const panes = this.getPanes()

        if (panes) {
          panes.overlayLayer.appendChild(this.canvas)
        }
      }

      draw() {
        const projection = this.getProjection()
        const map = this.getMap()

        if (!projection || !map || !('getBounds' in map)) return

        const gMap = map as google.maps.Map
        const bounds = gMap.getBounds()

        if (!bounds) return

        const ne = bounds.getNorthEast()
        const sw = bounds.getSouthWest()
        const nw = new google.maps.LatLng(ne.lat(), sw.lng())

        const topLeft = projection.fromLatLngToDivPixel(nw)
        const div = gMap.getDiv()

        if (!div || !topLeft) return

        const rect = div.getBoundingClientRect()
        this.canvas.style.left = `${topLeft.x}px`
        this.canvas.style.top = `${topLeft.y}px`
        this.canvas.width = rect.width
        this.canvas.height = rect.height

        const ctx = this.canvas.getContext('2d')

        if (!ctx) return

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        const baseRadius = 35

        data.forEach(item => {
          const pixel = projection.fromLatLngToDivPixel(
            new google.maps.LatLng(item.lat, item.lng)
          )

          if (!pixel) return

          const x = pixel.x - topLeft.x
          const y = pixel.y - topLeft.y

          const weight = metric === 'amount' ? item.amount : item.count
          const ratio = Math.min(1, weight / maxWeight)

          const grad = ctx.createRadialGradient(x, y, 0, x, y, baseRadius)
          const centerAlpha = 0.15 + ratio * 0.85
          grad.addColorStop(0, `rgba(0, 0, 0, ${centerAlpha})`)
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)')

          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(x, y, baseRadius, 0, Math.PI * 2)
          ctx.fill()
        })

        try {
          const imgData = ctx.getImageData(
            0,
            0,
            this.canvas.width,
            this.canvas.height
          )
          const pix = imgData.data

          for (let i = 0, n = pix.length; i < n; i += 4) {
            const alpha = pix[i + 3]

            if (alpha > 0) {
              pix[i] = palette[alpha * 4]
              pix[i + 1] = palette[alpha * 4 + 1]
              pix[i + 2] = palette[alpha * 4 + 2]
              pix[i + 3] = Math.min(235, palette[alpha * 4 + 3] * 1.3)
            }
          }
          ctx.putImageData(imgData, 0, 0)
        } catch {
          // Fallback if getImageData fails (e.g. cross-origin canvas)
        }
      }

      onRemove() {
        if (this.canvas.parentNode) {
          this.canvas.parentNode.removeChild(this.canvas)
        }
      }
    }

    const overlay = new CanvasHeatmapOverlay()
    overlay.setMap(map)

    return () => {
      overlay.setMap(null)
    }
  }, [map, data, metric])

  return null
}
