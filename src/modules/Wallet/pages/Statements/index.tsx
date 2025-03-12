import React, { useRef, useState } from 'react'

import { ModuleHeader, ModuleWrapper } from '@lifeforge/ui'

import PrintAndViewButton from './components/PrintAndViewButton'
import StatementContent from './components/StatementContent'
import YearMonthInput from './components/YearMonthInput'

function Statements(): React.ReactElement {
  const [year, setYear] = useState<number | null>(null)
  const [month, setMonth] = useState<number | null>(null)
  const [showStatement, setShowStatement] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <ModuleWrapper>
      <ModuleHeader icon="tabler:file-text" title="Financial Statements" />
      <YearMonthInput
        month={month}
        setMonth={setMonth}
        setYear={setYear}
        year={year}
      />
      {year !== null && month !== null && (
        <>
          <PrintAndViewButton
            contentRef={contentRef}
            setShowStatement={setShowStatement}
            showStatement={showStatement}
          />
          <StatementContent
            contentRef={contentRef}
            month={month}
            showStatement={showStatement}
            year={year}
          />
        </>
      )}
    </ModuleWrapper>
  )
}

export default Statements
