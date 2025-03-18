import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'

import {
  Button,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper
} from '@lifeforge/ui'

import useAPIQuery from '@hooks/useAPIQuery'

import Board from './components/Board'
import { type SudokuBoard } from './interfaces/sudoku_interfaces'

function Sudoku() {
  const dataQuery = useAPIQuery<SudokuBoard[]>('sudoku/evil', [
    'sudoku',
    'evil'
  ])
  const boardRef = useRef<HTMLDivElement>(null)
  const reactToPrintFn = useReactToPrint({ contentRef: boardRef })

  return (
    <ModuleWrapper>
      <ModuleHeader icon="uil:table" title="Sudoku" />
      <QueryWrapper query={dataQuery}>
        {data => (
          <div className="mt-6 space-y-2">
            <Button
              className="w-full"
              icon="uil:print"
              onClick={() => {
                reactToPrintFn()
              }}
            >
              Print
            </Button>
            <Button
              className="w-full"
              icon="uil:sync"
              variant="secondary"
              onClick={() => {
                dataQuery.refetch()
              }}
            >
              Refresh
            </Button>
            <div className="flex-center my-24!">
              <div
                ref={boardRef}
                className="mt-2 grid h-[297mm] w-[210mm] grid-cols-2 place-content-center place-items-center font-['Rubik']"
              >
                {data.map((board, index) => (
                  <Board key={index} data={board} />
                ))}
              </div>
            </div>
          </div>
        )}
      </QueryWrapper>
    </ModuleWrapper>
  )
}

export default Sudoku
