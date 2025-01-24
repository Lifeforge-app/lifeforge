import React, { useRef, useState } from 'react'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
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
      <ModuleHeader title="Financial Statements" icon="tabler:file-text" />
      <YearMonthInput
        month={month}
        setMonth={setMonth}
        year={year}
        setYear={setYear}
      />
      {year !== null && month !== null && (
        <>
          <PrintAndViewButton
            contentRef={contentRef}
            showStatement={showStatement}
            setShowStatement={setShowStatement}
          />
          <StatementContent
            contentRef={contentRef}
            month={month}
            year={year}
            showStatement={showStatement}
          />
        </>
      )}
    </ModuleWrapper>
  )
}

export default Statements
