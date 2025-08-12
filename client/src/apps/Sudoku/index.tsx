import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  Button,
  ListboxInput,
  ListboxOption,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper
} from 'lifeforge-ui'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useReactToPrint } from 'react-to-print'
import type { InferOutput } from 'shared'
import colors from 'tailwindcss/colors'

import Board from './components/Board'

export type SudokuBoard = InferOutput<
  typeof forgeAPI.sudoku.generateBoard
>[number]

const DIFFICULTIES = [
  { value: 'easy', color: colors.green[500] },
  { value: 'medium', color: colors.yellow[500] },
  { value: 'hard', color: colors.orange[500] },
  { value: 'expert', color: colors.blue[500] },
  { value: 'evil', color: colors.red[500] },
  { value: 'extreme', color: colors.gray[900] }
]

function Sudoku() {
  const [difficulty, setDifficulty] = useState<
    'easy' | 'medium' | 'hard' | 'expert' | 'evil' | 'extreme'
  >('evil')

  const { t } = useTranslation('apps.sudoku')

  const dataQuery = useQuery(
    forgeAPI.sudoku.generateBoard
      .input({
        difficulty,
        count: '6'
      })
      .queryOptions()
  )

  const boardRef = useRef<HTMLDivElement>(null)

  const reactToPrintFn = useReactToPrint({ contentRef: boardRef })

  return (
    <ModuleWrapper>
      <ModuleHeader icon="uil:table" title="Sudoku" />
      <ListboxInput
        buttonContent={
          <span className="flex items-center gap-2">
            <span
              className="block size-2 rounded-full"
              style={{
                backgroundColor: DIFFICULTIES.find(
                  diff => diff.value === difficulty
                )?.color
              }}
            />
            {t(`difficulties.${difficulty}`)}
          </span>
        }
        icon="tabler:category"
        label="difficulty"
        namespace="apps.sudoku"
        setValue={setDifficulty}
        value={difficulty}
      >
        {DIFFICULTIES.map((diff, index) => (
          <ListboxOption
            key={index}
            color={diff.color}
            text={t(`difficulties.${diff.value}`)}
            value={diff.value}
          />
        ))}
      </ListboxInput>
      <QueryWrapper query={dataQuery}>
        {data => (
          <div className="mt-4 space-y-2">
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
