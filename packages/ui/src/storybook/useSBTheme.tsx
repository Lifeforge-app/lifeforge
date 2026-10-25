/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'

/** Inline style values applied to elements based on the active Storybook theme mode. */
const BG_TEXT_STYLES = {
  dark: {
    backgroundColor: 'color-mix(in srgb, var(--color-bg-900) 50%, transparent)',
    color: 'var(--color-bg-50)'
  },
  light: {
    backgroundColor: 'color-mix(in srgb, var(--color-bg-200) 50%, transparent)',
    color: 'var(--color-bg-800)'
  }
}

/** Removes any previously applied background-color and color inline styles from an element. */
function clearBgTextStyles(el: HTMLElement) {
  el.style.removeProperty('background-color')
  el.style.removeProperty('color')
}

/**
 * Applies theme-appropriate background-color and color inline styles to an element.
 * Background is set with `!important` to override any conflicting stylesheet rules.
 */
function applyBgTextStyles(mode: 'dark' | 'light', el: HTMLElement) {
  el.style.setProperty(
    'background-color',
    BG_TEXT_STYLES[mode].backgroundColor,
    'important'
  )
  el.style.color = BG_TEXT_STYLES[mode].color
}

/**
 * Sets a solid black (dark) or white (light) foundation background on the given elements.
 * Uses `!important` so it acts as a canvas beneath semi-transparent story backgrounds.
 */
function addFoundaTionBg(mode: 'dark' | 'light', components: Element[]) {
  components.forEach(component => {
    ;(component as HTMLElement).style.setProperty(
      'background-color',
      mode === 'dark' ? 'black' : 'white',
      'important'
    )
  })
}

/**
 * Applies theme styles to all `.sbdocs-preview .docs-story` elements and their
 * `.sbdocs-preview` parent containers, ensuring story canvases match the active
 * Storybook theme.
 */
function styleSbDocsPreviews(theme: 'dark' | 'light') {
  const sbDocsPreviewStories = document.querySelectorAll(
    '.sbdocs-preview .docs-story'
  )

  sbDocsPreviewStories.forEach(preview => {
    clearBgTextStyles(preview as HTMLElement)
    applyBgTextStyles(theme, preview as HTMLElement)
  })

  addFoundaTionBg(
    theme,
    Array.from(document.querySelectorAll('.sbdocs-preview'))
  )
}

/**
 * Applies the foundation background color to the `<html>` element and ensures
 * it stretches to full viewport height.
 */
function styleHTML(theme: 'dark' | 'light') {
  addFoundaTionBg(theme, [document.documentElement])

  document.documentElement.style.height = '100%'
}

/**
 * Styles the `<body>` element for Storybook: sets flex column layout, full height,
 * smooth transition, and the `theme-custom` class. Also applies bg/text colors when
 * the docs panel is not visible.
 */
function styleBody(theme: 'dark' | 'light') {
  const body = document.body

  clearBgTextStyles(body)

  Object.assign(body.style, {
    display: 'flex',
    height: '100%',
    flexDirection: 'column'
  })
  body.classList.add('theme-custom')

  if (!document.querySelector('#storybook-docs:not([hidden])')) {
    applyBgTextStyles(theme, body)
  }
}

/**
 * Storybook decorator hook that synchronises DOM-level theme styles with the
 * active Storybook globals.
 *
 * Runs on mount and whenever the theme, theme color, background temperature or
 * font scale changes. Re-running on every global is required because
 * `PersonalizationProvider` remounts and rewrites the body background inline,
 * which would otherwise drop Storybook's light/dark canvas styling.
 */
export function useSBTheme(context: any) {
  const { bgTemp, fontScale, theme, themeColor } = context.globals

  useEffect(() => {
    styleSbDocsPreviews(theme)
    styleBody(theme)
    styleHTML(theme)
  }, [bgTemp, fontScale, theme, themeColor])
}
