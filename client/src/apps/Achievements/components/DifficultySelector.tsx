import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

import { AchievementsCollectionsSchemas } from 'shared/types'

function DifficultySelector({
  selectedDifficulty,
  setSelectedDifficulty
}: {
  selectedDifficulty: AchievementsCollectionsSchemas.IEntry['difficulty']
  setSelectedDifficulty: React.Dispatch<
    React.SetStateAction<AchievementsCollectionsSchemas.IEntry['difficulty']>
  >
}) {
  const { t } = useTranslation('apps.achievements')

  return (
    <div className="flex items-center">
      {(
        [
          ['easy', 'border-green-500 text-green-500'],
          ['medium', 'border-yellow-500 text-yellow-500'],
          ['hard', 'border-red-500 text-red-500'],
          ['impossible', 'border-purple-500 text-purple-500']
        ] as const
      ).map(([id, classNames], index) => (
        <button
          key={index}
          className={clsx(
            'w-full cursor-pointer border-b-2 p-2 tracking-widest uppercase transition-all',
            selectedDifficulty === id
              ? `${classNames} font-medium`
              : 'border-bg-400 text-bg-400 hover:border-bg-800 hover:text-bg-800 dark:border-bg-500 dark:text-bg-500 dark:hover:border-bg-200 dark:hover:text-bg-200'
          )}
          onClick={() => {
            setSelectedDifficulty(id)
          }}
        >
          {t(`difficulties.${id}`)}
        </button>
      ))}
    </div>
  )
}

export default DifficultySelector
