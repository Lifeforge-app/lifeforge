import { usePersonalization } from '@/providers'

function getBodyStyles(): Record<string, string> {
  if (typeof document === 'undefined') return {}

  const styleObj: Record<string, string> = {}

  const htmlStyle = document.documentElement.style

  for (let i = 0; i < htmlStyle.length; i++) {
    const key = htmlStyle[i]

    styleObj[key] = htmlStyle.getPropertyValue(key)
  }

  const bodyStyle = document.body.style

  for (let i = 0; i < bodyStyle.length; i++) {
    const key = bodyStyle[i]

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

  const rootStylesCss = Object.entries(bodyStyles)
    .map(([key, value]) => `${key}: ${value} !important;`)
    .join('\n')

  return (
    <div
      ref={contentRef}
      className={`${themeClasses} ${className} lf-statement-print-wrapper`}
      style={{
        ...bodyStyles,
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
