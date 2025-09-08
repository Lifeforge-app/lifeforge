import type { ReactNode } from 'react'

import { useFlowState } from '../hooks/useFlowState'
import { FlowStateContext } from '../hooks/useFlowStateContext'

export interface FlowStateProviderProps {
  children: ReactNode
}

export function FlowStateProvider({ children }: FlowStateProviderProps) {
  const flowState = useFlowState()

  return <FlowStateContext value={flowState}>{children}</FlowStateContext>
}
