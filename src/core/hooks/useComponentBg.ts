import { usePersonalization } from '@providers/PersonalizationProvider'
import { useMemo } from 'react'

export default function useComponentBg(): {
  componentBg: string
  componentBgWithHover: string
  componentBgLighter: string
  componentBgLighterWithHover: string
  darkerComponentBgWithHover: string
} {
  const { bgImage } = usePersonalization()

  const componentBg = useMemo(() => {
    if (bgImage !== '') return 'bg-bg-50/50 backdrop-blur-xs dark:bg-bg-900/50'
    return 'bg-bg-50 dark:bg-bg-900'
  }, [bgImage])

  const componentBgWithHover = useMemo(() => {
    if (bgImage !== '') {
      return 'bg-bg-50/50 backdrop-blur-xs dark:bg-bg-900/50 hover:bg-bg-100/50 dark:hover:bg-bg-800/50 transition-all'
    }
    return 'bg-bg-50 dark:bg-bg-900 dark:hover:bg-bg-800/70 hover:bg-bg-100 transition-all'
  }, [bgImage])

  const componentBgLighter = useMemo(() => {
    if (bgImage !== '') return 'bg-bg-100/50 dark:bg-bg-800/50'
    return 'bg-bg-100/50 dark:bg-bg-800/50'
  }, [bgImage])

  const componentBgLighterWithHover = useMemo(() => {
    if (bgImage !== '') {
      return 'bg-bg-100/50 dark:bg-bg-800/50 hover:bg-bg-200/50 dark:hover:bg-bg-700/50 transition-all'
    }
    return 'bg-bg-100/50 dark:bg-bg-800/50 dark:hover:bg-bg-800/80 hover:bg-bg-200/50 transition-all'
  }, [bgImage])

  const darkerComponentBgWithHover = useMemo(() => {
    if (bgImage !== '') {
      return 'bg-bg-50/50 backdrop-blur-xs dark:bg-bg-800/50 hover:bg-bg-200/50 dark:hover:bg-bg-700/50 transition-all'
    }
    return 'bg-bg-200 dark:bg-bg-800/50 dark:hover:bg-bg-800/80 hover:bg-bg-200 transition-all'
  }, [bgImage])

  return {
    componentBg,
    componentBgWithHover,
    componentBgLighter,
    componentBgLighterWithHover,
    darkerComponentBgWithHover
  }
}
