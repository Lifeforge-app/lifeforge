import type { NodeProps } from '@xyflow/react'

import type { NODE_TYPES } from '../nodes'

export interface IHandler {
  label: string
  nodeType: NODE_TYPES
  cardinality?: number | 'many'
  optional?: boolean
  filter?: {
    handler?: string[]
    node?: NODE_TYPES[]
  }
  dynamic?: boolean
  isWayToController?: boolean
}

export type INodeConfig<
  D extends Record<string, any> | undefined,
  H extends Record<string, IHandler>
> = {
  name: string
  icon: string
  component: React.ComponentType<NodeProps & { data: D }>
  color: string
  handlers: H
} & (D extends undefined ? { data?: never } : { data: D })
