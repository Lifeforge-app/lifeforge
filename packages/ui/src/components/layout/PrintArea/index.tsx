import { usePersonalization } from '@/providers'

function getBodyStyles(): Record<string, string> {
  if (typeof document === 'undefined') return {}

  const styleObj: Record<string, string> = {}

  const htmlStyle = document.documentElement.style

  for (let i = 0; i < htmlStyle.length; i++) {
    const key = htmlStyle[i]

    if (key === 'pointer-events') continue

    styleObj[key] = htmlStyle.getPropertyValue(key)
  }

  const bodyStyle = document.body.style

  for (let i = 0; i < bodyStyle.length; i++) {
    const key = bodyStyle[i]

    if (key === 'pointer-events') continue

    styleObj[key] = bodyStyle.getPropertyValue(key)
  }

  return styleObj
}

export function PrintArea({
  children,
  contentRef,
  className = '',
  style = {}
}: {
  children: React.ReactNode
  contentRef: React.RefObject<HTMLDivElement | null>
  className?: string
  style?: React.CSSProperties
}) {
  const {
    derivedTheme,
    rawThemeColor,
    bgTemp,
    bordered,
    fontScale,
    borderRadiusMultiplier
  } = usePersonalization()

  const bodyStyles = getBodyStyles()

  const themeClasses = [
    derivedTheme === 'dark' ? 'dark' : '',
    rawThemeColor,
    bgTemp,
    bordered ? 'bordered' : ''
  ]
    .filter(Boolean)
    .join(' ')

  const isBackgroundStyle = (key: string) =>
    key === 'background' || key === 'background-color'

  const nonBackgroundStyles = Object.fromEntries(
    Object.entries(bodyStyles).filter(([key]) => !isBackgroundStyle(key))
  )

  const backgroundStylesCss = Object.entries(bodyStyles)
    .filter(([key]) => isBackgroundStyle(key))
    .map(([key, value]) => `${key}: ${value} !important;`)
    .join('\n')

  const rootStylesCss = Object.entries(nonBackgroundStyles)
    .map(([key, value]) => `${key}: ${value} !important;`)
    .join('\n')

  return (
    <div
      ref={contentRef}
      className={`${themeClasses} ${className} lf-statement-print-wrapper`}
      style={{
        ...nonBackgroundStyles,
        width: '100%',
        ...style
      }}
    >
      <style>{`
        :root {
          --custom-font-scale: ${fontScale} !important;
          --custom-border-radius-multiplier: ${borderRadiusMultiplier} !important;
          ${rootStylesCss}
        }
        @media print {
          :root {
            ${backgroundStylesCss}
          }
          .lf-statement-print-wrapper {
            display: block !important;
          }
           .lf-statement-print-wrapper > * {
            height: auto !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
      {children}
    </div>
  )
}
