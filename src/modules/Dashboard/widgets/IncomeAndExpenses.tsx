import React from 'react'
import useThemeColors from '@hooks/useThemeColor'

export default function IncomeAndExpenses(): React.ReactElement {
  const { componentBg } = useThemeColors()

  return (
    <div
      className={`flex size-full flex-col gap-4 rounded-lg p-4 shadow-custom ${componentBg}`}
    ></div>
  )
}
