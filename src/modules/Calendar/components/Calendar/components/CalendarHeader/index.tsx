import React from 'react'
import { type NavigateAction, type View } from 'react-big-calendar'
import { useTranslation } from 'react-i18next'
import { Button } from '@components/buttons'
import useThemeColors from '@hooks/useThemeColor'
import ChangeViewButton from './components/ChangeViewButton'
import NavigationButton from './components/NavigationButton'

interface CalendarHeaderProps {
  label: string
  view: View
  onNavigate: (direction: NavigateAction) => void
  onView: (view: View) => void
  setModifyEventModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
}

function CalendarHeader({
  label,
  view: currentView,
  onNavigate,
  onView,
  setModifyEventModalOpenType
}: CalendarHeaderProps): React.ReactElement {
  const { t } = useTranslation('modules.calendar')
  const { componentBg } = useThemeColors()

  return (
    <div className="mb-4 flex w-full flex-col items-end justify-between gap-4 lg:flex-row">
      <div className="flex w-full items-center gap-4">
        <div className="flex-between flex w-full gap-2 lg:w-auto lg:justify-start">
          <NavigationButton direction="PREV" onNavigate={onNavigate} />
          <div className="block text-center text-2xl font-bold lg:hidden">
            {label}
          </div>
          <NavigationButton direction="NEXT" onNavigate={onNavigate} />
        </div>
        <div className="hidden text-center text-2xl font-bold lg:block">
          {label}
        </div>
      </div>
      <div className="flex w-full gap-4 lg:w-auto">
        <div
          className={`flex w-full gap-1 rounded-md p-2 shadow-custom ${componentBg}`}
        >
          {['Month', 'Week', 'Day', 'Agenda'].map(view => (
            <ChangeViewButton
              key={view}
              view={view}
              currentView={currentView}
              onView={onView}
            />
          ))}
        </div>
        <Button
          className="hidden whitespace-nowrap lg:flex"
          icon="tabler:plus"
          onClick={() => {
            setModifyEventModalOpenType('create')
          }}
          tProps={{ item: t('items.event') }}
        >
          new
        </Button>
      </div>
    </div>
  )
}

export default CalendarHeader
