import React from 'react'
import useThemeColors from '@hooks/useThemeColor'

export default function Achievements(): React.ReactElement {
  const { componentBg } = useThemeColors()

  return (
    <div
      className={`flex size-full flex-col gap-4 rounded-lg p-8 pt-6 shadow-custom ${componentBg}`}
    ></div>
  )
}
