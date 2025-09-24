import clsx from 'clsx'

import type { SudokuBoard } from '..'

function Board({
  data,
  showSolution
}: {
  data: SudokuBoard
  showSolution?: boolean
}) {
  return (
    <div className="aspect-square size-full p-4">
      <div className="border-bg-800 dark:border-bg-100 relative grid size-full grid-cols-9 border-[3px] print:border-black">
        {Array(9)
          .fill(0)
          .map((_, j) => (
            <div
              key={j}
              className={clsx(
                'grid size-full grid-rows-9',
                ![2, 5, 8].includes(j) &&
                  'border-bg-500 print:border-bg-400! border-r'
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
                        'border-bg-500 print:border-bg-400! border-b'
                    )}
                  >
                    <div className="flex size-full items-center justify-center text-lg">
                      {(() => {
                        const target = showSolution
                          ? data.solution
                          : data.mission

                        return (
                          <span
                            className={clsx(
                              showSolution &&
                                data.mission[k * 9 + j] === '0' &&
                                'text-custom-500 print:hidden!'
                            )}
                          >
                            {target[k * 9 + j] !== '0' && target[k * 9 + j]}
                          </span>
                        )
                      })()}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        <div className="absolute top-0 left-0 flex size-full justify-evenly">
          {Array(2)
            .fill(0)
            .map((_, j) => (
              <div
                key={j}
                className="bg-bg-800 dark:bg-bg-100 h-full w-[2px] print:bg-black!"
              />
            ))}
        </div>
        <div className="absolute top-0 left-0 flex size-full flex-col justify-evenly">
          {Array(2)
            .fill(0)
            .map((_, j) => (
              <div
                key={j}
                className="bg-bg-800 dark:bg-bg-100 h-[2px] w-full print:bg-black!"
              />
            ))}
        </div>
      </div>
    </div>
  )
}

export default Board
