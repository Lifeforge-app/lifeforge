import { useMemo } from 'react'
import colors from 'tailwindcss/colors'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'
import { toCamelCase } from '@utils/strings'

export default function useThemeColorHex(): string {
  const { themeColor } = usePersonalizationContext()
  const finalTheme = useMemo(() => {
    return colors[
      toCamelCase(
        themeColor.replace('theme-', '').replace(/-/g, ' ').replace('deep', '')
      ) as keyof typeof colors
    ][500]
  }, [themeColor])

  return finalTheme
}
