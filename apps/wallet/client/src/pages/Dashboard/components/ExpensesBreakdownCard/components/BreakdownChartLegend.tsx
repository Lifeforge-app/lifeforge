import { useContext } from 'react'

import { ExpensesBreakdownContext } from '..'

function BreakdownChartLegend() {
  const { expensesCategories } = useContext(ExpensesBreakdownContext)

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
      {expensesCategories.map(category => (
        <div key={category.id} className="flex items-center gap-2">
          <span
            className="-mb-0.5 size-3 rounded-full"
            style={{
              backgroundColor: category.color
            }}
          ></span>
          <span className="text-sm">{category.name}</span>
        </div>
      ))}
    </div>
  )
}

export default BreakdownChartLegend
