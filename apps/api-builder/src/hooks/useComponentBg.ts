export default function useComponentBg(): {
  componentBg: string
  componentBgWithHover: string
  componentBgLighter: string
  componentBgLighterWithHover: string
  darkerComponentBgWithHover: string
} {
  const componentBg = 'bg-bg-50 dark:bg-bg-900'
  const componentBgWithHover =
    'bg-bg-50 dark:bg-bg-900 dark:hover:bg-bg-800/70 hover:bg-bg-100 transition-all'
  const componentBgLighter = 'bg-bg-100/50 dark:bg-bg-800/50'
  const componentBgLighterWithHover =
    'bg-bg-100/50 dark:bg-bg-800/50 dark:hover:bg-bg-800/80 hover:bg-bg-200/50 transition-all'

  const darkerComponentBgWithHover =
    'bg-bg-200 dark:bg-bg-800/50 dark:hover:bg-bg-800/80 hover:bg-bg-200 transition-all'

  return {
    componentBg,
    componentBgWithHover,
    componentBgLighter,
    componentBgLighterWithHover,
    darkerComponentBgWithHover
  }
}
