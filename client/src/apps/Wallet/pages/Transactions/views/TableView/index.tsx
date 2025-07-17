import { Scrollbar } from '@lifeforge/ui'

import TableBody from './components/TableBody'
import TableHeader from './components/TableHeader'

function TableView({ visibleColumn }: { visibleColumn: string[] }) {
  return (
    <Scrollbar>
      <table className="mb-16 w-max min-w-full">
        <TableHeader visibleColumn={visibleColumn} />
        <TableBody visibleColumn={visibleColumn} />
      </table>
    </Scrollbar>
  )
}

export default TableView
