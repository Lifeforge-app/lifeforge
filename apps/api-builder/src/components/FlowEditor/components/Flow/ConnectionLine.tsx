import { useConnection } from '@xyflow/react'
import { useMemo } from 'react'

import NODE_CONFIG, { type NODE_TYPES } from '../../nodes'

function ConnectionLine({
  fromX,
  fromY,
  toX,
  toY
}: {
  fromX: number
  fromY: number
  toX: number
  toY: number
}) {
  const { toNode, fromHandle, fromNode } = useConnection()
  const color = useMemo(() => {
    return (
      NODE_CONFIG[
        (fromHandle?.type === 'source' ? fromNode : toNode)?.type as NODE_TYPES
      ]?.color || 'gray'
    )
  }, [fromHandle, fromNode, toNode])

  return (
    <g>
      <path
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        className="animated"
        d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#fff"
        r={3}
        stroke={color}
        strokeWidth={1.5}
      />
    </g>
  )
}

export default ConnectionLine
