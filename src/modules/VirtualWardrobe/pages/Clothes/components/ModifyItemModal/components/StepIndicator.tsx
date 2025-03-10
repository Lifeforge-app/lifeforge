import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'

function StepIndicator({
  step,
  openType
}: {
  step: number
  openType: 'create' | 'update' | null
}): React.ReactElement {
  const { t } = useTranslation('modules.virtualWardrobe')

  return (
    <ol className="text-bg-500 flex w-full items-center text-sm font-medium sm:text-base">
      {['Upload Photos', 'Basic Info', 'Appearance And Details'].map(
        (text, index) => (
          <li
            key={index}
            className={clsx(
              'flex items-center',
              index + 1 <= step ? 'text-custom-500' : 'text-bg-500',
              index !== 2 &&
                'after:mx-4 after:hidden after:h-0.5 after:w-full sm:after:inline-block sm:after:content-[""] md:w-full xl:after:mx-4',
              index + 1 < step
                ? 'after:bg-custom-500'
                : 'after:bg-bg-300 dark:after:bg-bg-700'
            )}
          >
            <div className="flex items-center whitespace-nowrap after:mx-2 after:content-['/'] sm:after:hidden">
              <span
                className={clsx(
                  'mr-3 flex size-6 items-center justify-center rounded-full font-medium lg:size-10',
                  index + 1 === step && 'border-custom-500 border-2',
                  index + 1 < step &&
                    'bg-custom-500 text-bg-100 dark:text-bg-900',
                  index + 1 > step && 'bg-bg-500 text-bg-100 dark:text-bg-900'
                )}
              >
                {openType === 'update' && index === 0 ? (
                  <Icon className="size-5" icon="tabler:lock" />
                ) : (
                  index + 1
                )}
              </span>{' '}
              {t(`steps.${toCamelCase(text)}`)}
            </div>
          </li>
        )
      )}
    </ol>
  )
}

export default StepIndicator
