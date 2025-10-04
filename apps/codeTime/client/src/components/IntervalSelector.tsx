import clsx from 'clsx'
import { Listbox, ListboxOption } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

function IntervalSelector<T extends string>({
  options,
  lastFor,
  setLastFor,
  className
}: {
  options: T[]
  lastFor: T
  setLastFor: (value: T) => void
  className?: string
}) {
  const { t } = useTranslation('apps.codeTime')

  return (
    <div className={clsx('shrink-0 items-center gap-3', className)}>
      <p className="text-bg-500 hidden shrink-0 font-medium tracking-wider md:block">
        {t('labels.inThePast')}
      </p>
      <Listbox
        buttonContent={
          <span>{`${lastFor.split(' ')[0]} ${t(`units.${lastFor.split(' ')[1].toLowerCase()}`)}`}</span>
        }
        className="w-full! md:w-48!"
        setValue={setLastFor}
        value={lastFor}
      >
        {options.map((last, index) => (
          <ListboxOption
            key={index}
            icon="tabler:clock"
            label={`${last.split(' ')[0]} ${t(`units.${last.split(' ')[1].toLowerCase()}`)}`}
            value={last}
          />
        ))}
      </Listbox>
    </div>
  )
}

export default IntervalSelector
