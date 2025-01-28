import React from 'react'
import Overview from './components/sections/Overview'
import Transactions from './components/sections/Transactions'
import StatementHeader from './components/StatementHeader'
import StatementEndedText from '../StatementEndedText'

function StatementContent({
  contentRef,
  showStatement,
  month,
  year
}: {
  contentRef: React.RefObject<HTMLDivElement | null>
  showStatement: boolean
  month: number
  year: number
}): React.ReactElement {
  return (
    <div
      ref={contentRef}
      className={`print-area relative my-6 flex h-0 w-full flex-col overflow-hidden font-[Outfit] transition-all duration-500 [interpolate-size:allow-keywords] print:!w-[1200px] print:bg-white print:text-black ${
        !showStatement ? 'h-0 print:h-auto' : 'h-full! duration-[1.5s]'
      }`}
    >
      <div className="size-full">
        <StatementHeader month={month} year={year} />
        <Overview month={month} year={year} />
        <Transactions month={month} year={year} />
        <StatementEndedText />
      </div>
    </div>
  )
}

export default StatementContent
