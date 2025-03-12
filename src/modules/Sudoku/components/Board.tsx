import clsx from 'clsx'

import { type SudokuBoard } from '../interfaces/sudoku_interfaces'

function Board({ data }: { data: SudokuBoard }) {
  return (
    <div className="aspect-square size-full p-4">
      <div className="relative grid size-full grid-cols-9 border-[3px] border-zinc-800 dark:border-zinc-100 print:border-black">
        {Array(9)
          .fill(0)
          .map((_, j) => (
            <div
              key={j}
              className={clsx(
                'grid size-full grid-rows-9',
                ![2, 5, 8].includes(j) &&
                  'print:border-zinc-400! border-r border-zinc-500'
              )}
            >
              {Array(9)
                .fill(0)
                .map((_, k) => (
                  <div
                    key={k}
                    className={clsx(
                      'size-full',
                      ![2, 5, 8].includes(k) &&
                        'print:border-zinc-400! border-b border-zinc-500'
                    )}
                  >
                    {data.mission[k * 9 + j] !== '0' && (
                      <div className="flex size-full items-center justify-center text-lg">
                        {data.mission[k * 9 + j]}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ))}
        <div className="absolute left-0 top-0 flex size-full justify-evenly">
          {Array(2)
            .fill(0)
            .map((_, j) => (
              <div
                key={j}
                className="print:bg-black! h-full w-[2px] bg-zinc-800 dark:bg-zinc-100"
              />
            ))}
        </div>
        <div className="absolute left-0 top-0 flex size-full flex-col justify-evenly">
          {Array(2)
            .fill(0)
            .map((_, j) => (
              <div
                key={j}
                className="print:bg-black! h-[2px] w-full bg-zinc-800 dark:bg-zinc-100"
              />
            ))}
        </div>
      </div>
    </div>
  )
}

export default Board
