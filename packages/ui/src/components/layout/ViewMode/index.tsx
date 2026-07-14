import type React from 'react'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { create } from 'zustand'

import { useModuleMetadata } from '@lifeforge/federation'
import { useModuleTranslation } from '@lifeforge/localization'

import useNuqsOrBasicState from '@/hooks/useNuqsOrBasicState'

import { ViewModeContextMenuSelector as ViewModeContextMenuSelectorComponent } from './components/ViewModeContextMenuSelector'
import { ViewModeSelector as ViewModeSelectorComponent } from './components/ViewModeSelector'

export interface ViewModeState<TMode extends string = string> {
  currentMode: TMode
  setCurrentMode: (mode: TMode) => void
}

interface CreateViewModeConfig<
  TViewModes extends ReadonlyArray<{
    value: string
    icon?: string
    text?: string
  }>
> {
  modes: TViewModes
  defaultValue?: TViewModes[number]['value']
  namespace?: string | false
  useNuqs?: boolean
  persistInLocalStorage?: boolean | string
  selectorProps?: Omit<
    React.ComponentProps<typeof ViewModeSelectorComponent>,
    'modes' | 'currentMode' | 'onModeChange'
  >
  contextMenuSelectorProps?: Omit<
    React.ComponentProps<typeof ViewModeContextMenuSelectorComponent>,
    'modes' | 'currentMode' | 'onModeChange'
  >
}

export interface ViewModeRootProps<
  TViewModes extends ReadonlyArray<{
    value: string
    icon?: string
    text?: string
  }>
> {
  children: React.ReactNode
  currentMode?: TViewModes[number]['value']
  onModeChange?: (mode: TViewModes[number]['value']) => void
}

export function createViewMode<
  const TViewModes extends ReadonlyArray<{
    value: string
    icon?: string
    text?: string
  }>
>({
  modes,
  namespace,
  persistInLocalStorage = true,
  defaultValue,
  useNuqs = true,
  selectorProps: configSelectorProps,
  contextMenuSelectorProps: configContextMenuSelectorProps
}: CreateViewModeConfig<TViewModes>) {
  const modeValues = modes.map(m => m.value)

  const useContext = create<ViewModeState<TViewModes[number]['value']>>(
    set => ({
      currentMode: (defaultValue ??
        modeValues[0]) as TViewModes[number]['value'],
      setCurrentMode: (mode: TViewModes[number]['value']) =>
        set({ currentMode: mode })
    })
  )

  function Root({
    children,
    currentMode: controlledMode,
    onModeChange: controlledOnModeChange
  }: ViewModeRootProps<TViewModes>) {
    const { name: moduleName } = useModuleMetadata()

    const storageKey = useMemo(() => {
      if (!persistInLocalStorage) return null

      const suffix =
        persistInLocalStorage === true ? 'view-mode' : persistInLocalStorage

      return `${moduleName}-${suffix}`
    }, [moduleName])

    const storedDefault =
      typeof window !== 'undefined' && storageKey
        ? (localStorage.getItem(storageKey) as
            TViewModes[number]['value'] | null)
        : null

    const effectiveDefault = storedDefault ?? defaultValue

    const [currentMode, setCurrentMode] = useNuqsOrBasicState({
      options: modeValues,
      defaultValue: effectiveDefault,
      useNuqs: useNuqs ? 'view' : false,
      controlled: {
        value: controlledMode ?? null,
        setValue: controlledOnModeChange ?? null
      }
    })

    const setCurrentModeRef = useRef(setCurrentMode)

    setCurrentModeRef.current = setCurrentMode

    useEffect(() => {
      useContext.setState({
        setCurrentMode: (mode: TViewModes[number]['value']) => {
          useContext.setState({ currentMode: mode })
          setCurrentModeRef.current(mode)
        }
      })
    }, [])

    useLayoutEffect(() => {
      useContext.setState({ currentMode })
    }, [currentMode])

    useEffect(() => {
      if (storageKey) {
        localStorage.setItem(storageKey, currentMode)
      }
    }, [storageKey, currentMode])

    return <>{children}</>
  }

  function When({
    mode,
    children
  }: {
    mode: TViewModes[number]['value']
    children: React.ReactNode
  }) {
    const currentMode = useContext(s => s.currentMode)

    if (mode !== currentMode) {
      return null
    }

    return <>{children}</>
  }

  function Selector(
    props?: Omit<
      React.ComponentProps<typeof ViewModeSelectorComponent>,
      'modes' | 'currentMode' | 'onModeChange'
    >
  ) {
    const { currentMode, setCurrentMode } = useContext()

    const { t } = useModuleTranslation(
      namespace === false ? [] : namespace ? [namespace] : []
    )

    const items = useMemo(
      () =>
        modes.map(mode => ({
          ...mode,
          text: namespace === false || !mode.text ? mode.text : t(mode.text)
        })),
      []
    )

    return (
      <ViewModeSelectorComponent
        currentMode={currentMode}
        modes={items as unknown as typeof modes}
        onModeChange={setCurrentMode}
        {...configSelectorProps}
        {...props}
      />
    )
  }

  function ContextMenuSelector(
    props?: Omit<
      React.ComponentProps<typeof ViewModeContextMenuSelectorComponent>,
      'modes' | 'currentMode' | 'onModeChange'
    >
  ) {
    const { currentMode, setCurrentMode } = useContext()

    const { t } = useModuleTranslation(
      namespace === false ? [] : namespace ? [namespace] : []
    )

    const items = useMemo(
      () =>
        modes.map(mode => ({
          ...mode,
          text: namespace === false || !mode.text ? mode.text : t(mode.text)
        })),
      []
    )

    return (
      <ViewModeContextMenuSelectorComponent
        currentMode={currentMode}
        modes={items as unknown as typeof modes}
        onModeChange={setCurrentMode}
        {...configContextMenuSelectorProps}
        {...props}
      />
    )
  }

  return { Root, When, Selector, ContextMenuSelector, useContext }
}

export type { ViewModeContextMenuSelectorProps } from './components/ViewModeContextMenuSelector'

export type { ViewModeSelectorProps } from './components/ViewModeSelector'
