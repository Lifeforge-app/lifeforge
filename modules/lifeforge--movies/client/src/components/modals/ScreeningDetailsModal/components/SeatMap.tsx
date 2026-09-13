import { useEffect, useRef } from 'react'

import type { InferOutput } from '@lifeforge/api'
import { TAILWIND_PALETTE, usePersonalization } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

type SeatPlanData = InferOutput<typeof forgeAPI.tgv.getSeatPlan>

const SEAT = 28
const GAP = 4
const PAD = 40
const LABEL_W = 50
const SCREEN_PAD = 80
const SCR_H = 30

function SeatMap({ data }: { data: SeatPlanData }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { bgTempPalette, derivedTheme } = usePersonalization()

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    const allRows: SeatPlanData['areas'][0]['rows'][0]['seats'][] = []
    const rowLabels: string[] = []

    let maxCol = 0

    for (const area of data.areas) {
      for (const row of area.rows) {
        if (row.seats.length === 0) continue
        allRows.push(row.seats)
        rowLabels.push(row.physicalName)

        for (const seat of row.seats) {
          maxCol = Math.max(maxCol, seat.columnIndex)
        }
      }
    }

    const numRows = allRows.length
    const numCols = maxCol + 1

    const seatGrid: (
      | SeatPlanData['areas'][0]['rows'][0]['seats'][0]
      | null
    )[][] = Array.from({ length: numRows }, () => Array(numCols).fill(null))

    for (let r = 0; r < allRows.length; r++) {
      for (const seat of allRows[r]) {
        seatGrid[r][seat.columnIndex] = seat
      }
    }

    const seatW = numCols * (SEAT + GAP) - GAP
    const seatH = numRows * (SEAT + GAP) - GAP
    const w = PAD + LABEL_W + seatW + LABEL_W + PAD
    const h = SCREEN_PAD + PAD + seatH + PAD

    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)

    ctx.fillStyle = bgTempPalette[derivedTheme === 'dark' ? 800 : 100]
    ctx.fillRect(0, 0, w, h)

    const computed = getComputedStyle(canvas)
    ctx.font = computed.font
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const rendered = new Set<string>()

    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        const seat = seatGrid[r][c]

        if (!seat) continue

        const key = `${r},${c}`

        if (rendered.has(key)) continue

        const x = PAD + LABEL_W + (numCols - 1 - c) * (SEAT + GAP)
        const y = SCREEN_PAD + PAD + (numRows - 1 - r) * (SEAT + GAP)

        ctx.fillStyle =
          seat.status === 0
            ? bgTempPalette[derivedTheme === 'dark' ? '700' : '300']
            : TAILWIND_PALETTE.rose[500]

        if (seat.seatsInGroup && seat.seatsInGroup.length === 2) {
          const otherCol = seat.seatsInGroup[1].columnIndex
          const c1 = Math.min(c, otherCol)
          const c2 = Math.max(c, otherCol)
          const x1 = PAD + LABEL_W + (numCols - 1 - c2) * (SEAT + GAP)
          const x2 =
            PAD + LABEL_W + (numCols - 1 - c1) * (SEAT + GAP) + SEAT - 1
          ctx.beginPath()
          ctx.roundRect(x1, y, x2 - x1 + 1, SEAT - 1, 4)
          ctx.fill()
          rendered.add(`${r},${otherCol}`)
        } else {
          ctx.beginPath()
          ctx.roundRect(x, y, SEAT - 1, SEAT - 1, 4)
          ctx.fill()
        }
      }
    }

    // Row labels
    ctx.fillStyle = bgTempPalette[500]

    for (let r = 0; r < numRows; r++) {
      const y = SCREEN_PAD + PAD + (numRows - 1 - r) * (SEAT + GAP) + SEAT / 2
      const label = rowLabels[r]

      // Left
      ctx.fillText(label, PAD + LABEL_W / 2, y)
      // Right
      ctx.fillText(label, w - PAD - LABEL_W / 2, y)
    }

    // Screen curve
    const arcLeft = PAD + LABEL_W
    const arcRight = PAD + LABEL_W + seatW
    const screenY = SCREEN_PAD

    ctx.strokeStyle = bgTempPalette[500]
    ctx.lineWidth = 2
    ctx.beginPath()

    for (let x = arcLeft; x <= arcRight; x++) {
      const t = (x - arcLeft) / (arcRight - arcLeft)
      const y = screenY - SCR_H * (4 * t * (1 - t))

      if (x === arcLeft) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }

    ctx.stroke()

    // Screen text
    ctx.fillStyle = bgTempPalette[500]
    ctx.fillText('SCREEN', w / 2, screenY - SCR_H - 12)
  }, [data])

  return <canvas ref={canvasRef} style={{ width: '100%' }} />
}

export default SeatMap
