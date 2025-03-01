import { Icon } from '@iconify/react/dist/iconify.js'
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
    <ol className="flex w-full items-center text-sm font-medium text-bg-500 sm:text-base">
      {['Upload Photos', 'Basic Info', 'Appearance And Details'].map(
        (text, index) => (
          <li
            key={index}
            className={`flex items-center ${
              index + 1 <= step ? 'text-custom-500' : 'text-bg-500'
            } ${
              index !== 2 &&
              `after:mx-4 after:hidden after:h-0.5 after:w-full ${
                index + 1 < step
                  ? 'after:bg-custom-500'
                  : 'after:bg-bg-300 dark:after:bg-bg-700'
              } sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-4`
            }`}
          >
            <div className="flex items-center whitespace-nowrap after:mx-2 after:content-['/'] sm:after:hidden ">
              <span
                className={`mr-3 flex size-6 items-center justify-center rounded-full font-medium lg:size-10 ${(() => {
                  if (index + 1 === step) {
                    return 'border-2 border-custom-500'
                  }

                  if (index + 1 < step) {
                    return 'bg-custom-500 text-bg-100 dark:text-bg-900'
                  }

                  return 'bg-bg-500 text-bg-100 dark:text-bg-900'
                })()}`}
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
