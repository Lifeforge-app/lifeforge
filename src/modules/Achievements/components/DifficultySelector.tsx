import { t } from 'i18next'
import React from 'react'

function DifficultySelector({
  selectedDifficulty,
  setSelectedDifficulty
}: {
  selectedDifficulty: string
  setSelectedDifficulty: React.Dispatch<React.SetStateAction<string>>
}): React.ReactElement {
  return (
    <div className="mt-6 flex items-center">
      {[
        ['easy', 'border-green-500', 'text-green-500'],
        ['medium', 'border-yellow-500', 'text-yellow-500'],
        ['hard', 'border-red-500', 'text-red-500'],
        ['impossible', 'border-purple-500', 'text-purple-500']
      ].map((achievement, index) => (
        <button
          key={index}
          onClick={() => {
            setSelectedDifficulty(achievement[0])
          }}
          className={`w-full cursor-pointer border-b-2 p-2 uppercase tracking-widest transition-all ${
            selectedDifficulty === achievement[0]
              ? `${achievement[1]} ${achievement[2]} font-medium`
              : 'border-bg-400 text-bg-400 hover:border-bg-800 hover:text-bg-800 dark:border-bg-500 dark:text-bg-500 dark:hover:border-bg-200 dark:hover:text-bg-200'
          }`}
        >
          {t(`achievements.difficulties.${achievement[0]}`)}
        </button>
      ))}
    </div>
  )
}

export default DifficultySelector