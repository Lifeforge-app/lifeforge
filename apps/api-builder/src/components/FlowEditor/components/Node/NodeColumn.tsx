import { Handle, Position, useNodeConnections, useNodeId } from '@xyflow/react'
import clsx from 'clsx'
import _ from 'lodash'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useFlowStateContext } from '../../hooks/useFlowStateContext'
import NODE_CONFIG, { type NODE_TYPES } from '../../nodes'
import type { IHandler } from '../../typescript/node'

type NodeHandlers<T extends NODE_TYPES> = (typeof NODE_CONFIG)[T]['handlers']
type NodeHandlerKey<T extends NODE_TYPES> = keyof NodeHandlers<T>

type BaseProps = {
  label?: string
  children?: React.ReactNode
}

type NonDynamicColumn<T extends NODE_TYPES, K extends NodeHandlerKey<T>> = {
  nodeType: T
  handle: K
} & BaseProps

type DynamicColumn<T extends NODE_TYPES, K extends NodeHandlerKey<T>> = {
  nodeType: T
  handle: K
  dynamicId: string
} & BaseProps

type NodeColumnProps<T extends NODE_TYPES> =
  | {
      [K in NodeHandlerKey<T>]: NodeHandlers<T>[K] extends { dynamic: true }
        ? DynamicColumn<T, K>
        : NonDynamicColumn<T, K>
    }[NodeHandlerKey<T>]
  | ({
      nodeType?: never
      handle?: never
    } & BaseProps)

function NodeColumn<T extends NODE_TYPES>({
  nodeType,
  handle,
  label,
  children,
  ...props
}: NodeColumnProps<T>) {
  const { t } = useTranslation('core.apiBuilder')
  const nodeId = useNodeId()
  const connections = useNodeConnections()
  const { setEdges } = useFlowStateContext()
  const dynamicId =
    'dynamicId' in props ? (props.dynamicId as string) : undefined

  const handler = useMemo(() => {
    if (!nodeType || !handle) return undefined

    const handlers = NODE_CONFIG[nodeType].handlers
    if (handle in handlers) {
      return handlers[handle as keyof typeof handlers] as IHandler
    }

    return undefined
  }, [nodeType, handle])

  const isInput = useMemo(() => {
    return handle ? (handle as string).endsWith('input') : true
  }, [handle])

  const filteredConnections = useMemo(() => {
    if (!handle) return []

    return connections.filter(connection =>
      isInput
        ? connection.targetHandle === handle && connection.target === nodeId
        : connection.sourceHandle === handle && connection.source === nodeId
    )
  }, [handle, nodeId, connections, isInput])

  const isConnectable = useMemo(() => {
    if (!handler) return true
    if (handler.cardinality === 'many' || !handler.cardinality) {
      return true
    }
    return filteredConnections.length < handler.cardinality
  }, [handler, filteredConnections.length])

  useEffect(() => {
    return () => {
      if (dynamicId && handle) {
        const handleId = (handle as string) + '||' + dynamicId

        setEdges(prevEdges =>
          prevEdges.filter(
            edge =>
              edge.sourceHandle !== handleId &&
              edge.targetHandle !== handleId &&
              edge.source !== nodeId &&
              edge.target !== nodeId
          )
        )
      }
    }
  }, [])

  if (!handler?.label && !label) {
    return <></>
  }

  return (
    <div className="relative space-y-1">
      <label
        className={clsx(
          'text-bg-500 block w-full text-sm font-medium',
          isInput ? 'text-left' : 'text-right'
        )}
      >
        {t([
          ...(handler?.label
            ? [
                `nodes.${_.camelCase(handler.label)}`,
                `nodeColumns.${_.camelCase(handler.label)}`,
                handler.label
              ]
            : []),
          ...(label
            ? [
                `nodes.${_.camelCase(label)}`,
                `nodeColumns.${_.camelCase(label)}`,
                label
              ]
            : [])
        ])}{' '}
        {dynamicId ? `(${dynamicId})` : ''}
      </label>
      {children && <div>{children}</div>}
      {handler && handle && (
        <Handle
          type={isInput ? 'target' : 'source'}
          position={isInput ? Position.Left : Position.Right}
          id={(handle as string) + (dynamicId ? `||${dynamicId}` : '')}
          className={clsx(
            'border-bg-200 dark:border-bg-900 top-2.5! size-3! rounded-full border',
            isInput ? 'right-auto! -left-3!' : '-right-3!'
          )}
          isConnectable={isConnectable}
          style={{ backgroundColor: NODE_CONFIG[handler.nodeType]?.color }}
        />
      )}
    </div>
  )
}

export default NodeColumn
