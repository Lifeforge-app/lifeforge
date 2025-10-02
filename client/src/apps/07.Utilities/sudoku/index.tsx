import { Icon } from '@iconify/react/dist/iconify.js'
import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  Button,
  ListboxInput,
  ListboxOption,
  ModuleHeader,
  Switch,
  WithQuery
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

  const [showSolution, setShowSolution] = useState(false)

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
    <>
      <ModuleHeader />
      <div>
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
              label={t(`difficulties.${diff.value}`)}
              value={diff.value}
            />
          ))}
        </ListboxInput>
        <div className="mt-4 flex items-center justify-between py-2">
          <div className="text-bg-500 flex items-center gap-2">
            <Icon className="size-6" icon="tabler:eye" />
            <span className="text-lg">{t('inputs.showSolution')}</span>
          </div>
          <Switch
            checked={showSolution}
            onChange={() => {
              setShowSolution(!showSolution)
            }}
          />
        </div>
      </div>
      <WithQuery query={dataQuery}>
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
              loading={dataQuery.isRefetching}
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
                  <Board key={index} data={board} showSolution={showSolution} />
                ))}
              </div>
            </div>
          </div>
        )}
      </WithQuery>
    </>
  )
}

export default Sudoku
