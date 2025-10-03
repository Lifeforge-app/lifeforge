import { createContext, useContext } from 'react'

import type { FlowState, FlowStateActions } from './useFlowState'

export interface FlowStateContextValue extends FlowState, FlowStateActions {}

export const FlowStateContext = createContext<
  FlowStateContextValue | undefined
>(undefined)

export function useFlowStateContext(): FlowStateContextValue {
  const context = useContext(FlowStateContext)

  if (context === undefined) {
    throw new Error(
      'useFlowStateContext must be used within a FlowStateProvider'
    )
  }

  return context
}
