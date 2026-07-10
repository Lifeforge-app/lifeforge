import type React from 'react'
import { createContext, useContext, useEffect, useMemo } from 'react'

import { useModuleMetadata } from '@lifeforge/federation'

import {
  ViewModeContextMenuSelector as ViewModeContextMenuSelectorComponent,
  ViewModeSelector as ViewModeSelectorComponent
} from '@/components/data-display'
import useNuqsOrBasicState from '@/hooks/useNuqsOrBasicState'

interface ViewModeContextValues<TMode extends string = string> {
  View: (props: { mode: TMode; children: React.ReactNode }) => React.ReactNode
  ViewModeSelector: () => React.ReactNode
  ViewModeContextMenuSelector: () => React.ReactNode
  currentMode: TMode
  setCurrentMode: (mode: TMode) => void
}

interface WithViewModeProps<
  TViewModes extends ReadonlyArray<{
    value: string
    icon?: string
    text?: string
  }>
> {
  children: ({
    View,
    ViewModeSelector,
    ViewModeContextMenuSelector,
    currentMode
  }: ViewModeContextValues<TViewModes[number]['value']>) => React.ReactElement
  modes: TViewModes
  defaultValue?: TViewModes[number]['value']
  useNuqs?: boolean
  currentMode?: TViewModes[number]['value']
  onModeChange?: (mode: TViewModes[number]['value']) => void
  selectorProps?: Omit<
    React.ComponentProps<typeof ViewModeSelectorComponent>,
    'modes' | 'currentMode' | 'onModeChange'
  >
  contextMenuSelectorProps?: Omit<
    React.ComponentProps<typeof ViewModeContextMenuSelectorComponent>,
    'modes' | 'currentMode' | 'onModeChange'
  >
  persistInLocalStorage?: boolean | string
}

const ViewModeContext = createContext<ViewModeContextValues | undefined>(
  undefined
)

export function useViewModeContext<
  TValue extends string
>(): ViewModeContextValues<TValue> {
  const context = useContext(ViewModeContext)

  if (!context) {
    throw new Error(
      'useViewModeContext must be used inside a WithViewMode component'
    )
  }

  return context as unknown as ViewModeContextValues<TValue>
}

function ViewComponent<TViewMode extends string>({
  mode,
  children
}: {
  mode: TViewMode
  children: React.ReactNode
}) {
  const { currentMode } = useViewModeContext()

  if (mode !== currentMode) {
    return null
  }

  return children
}

export function WithViewMode<
  const TViewModes extends ReadonlyArray<{
    value: string
    icon?: string
    text?: string
  }>
>({
  children,
  modes,
  persistInLocalStorage = true,
  defaultValue,
  useNuqs = true,
  currentMode: controlledMode,
  onModeChange: controlledOnModeChange,
  selectorProps,
  contextMenuSelectorProps
}: WithViewModeProps<TViewModes>) {
  const modeValues = modes.map(m => m.value)

  const { name: moduleName } = useModuleMetadata()

  const storageKey = useMemo(() => {
    if (!persistInLocalStorage) return null

    const suffix =
      persistInLocalStorage === true ? 'view-mode' : persistInLocalStorage

    return `${moduleName}-${suffix}`
  }, [persistInLocalStorage, moduleName])

  const storedDefault =
    typeof window !== 'undefined' && storageKey
      ? (localStorage.getItem(storageKey) as TViewModes[number]['value'] | null)
      : null

  const effectiveDefault = storedDefault ?? defaultValue

  const [currentMode, setCurrentMode] = useNuqsOrBasicState({
    options: modeValues,
    defaultValue: effectiveDefault,
    useNuqs: useNuqs ? 'view' : false,
    controlled: {
      value: controlledMode || null,
      setValue: controlledOnModeChange || null
    }
  })

  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, currentMode)
    }
  }, [storageKey, currentMode])

  function BoundViewModeSelector() {
    return (
      <ViewModeSelectorComponent
        currentMode={currentMode}
        modes={modes}
        onModeChange={setCurrentMode}
        {...selectorProps}
      />
    )
  }

  function BoundViewModeContextMenuSelector() {
    return (
      <ViewModeContextMenuSelectorComponent
        currentMode={currentMode}
        modes={modes}
        onModeChange={setCurrentMode}
        {...contextMenuSelectorProps}
      />
    )
  }

  const contextValues: ViewModeContextValues<TViewModes[number]['value']> = {
    View: ViewComponent,
    ViewModeContextMenuSelector: BoundViewModeContextMenuSelector,
    ViewModeSelector: BoundViewModeSelector,
    currentMode,
    setCurrentMode
  }

  return (
    <ViewModeContext value={contextValues}>
      {children(contextValues)}
    </ViewModeContext>
  )
}
