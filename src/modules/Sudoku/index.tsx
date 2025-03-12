import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'

import { APIFallbackComponent, Button , ModuleWrapper , ModuleHeader } from '@lifeforge/ui'

import useFetch from '@hooks/useFetch'

import Board from './components/Board'
import { type SudokuBoard } from './interfaces/sudoku_interfaces'

function Sudoku(): React.ReactElement {
  const [data, refreshData] = useFetch<SudokuBoard[]>('sudoku/evil')
  const boardRef = useRef<HTMLDivElement>(null)
  const reactToPrintFn = useReactToPrint({ contentRef: boardRef })

  return (
    <ModuleWrapper>
      <ModuleHeader icon="uil:table" title="Sudoku" />
      <APIFallbackComponent data={data}>
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
                refreshData()
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
      </APIFallbackComponent>
    </ModuleWrapper>
  )
}

export default Sudoku
