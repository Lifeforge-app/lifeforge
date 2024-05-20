/* eslint-disable @typescript-eslint/indent */
import React from 'react'
import { type NavigateAction, type View } from 'react-big-calendar'
import ChangeViewButton from './components/ChangeViewButton'
import NavigationButton from './components/NavigationButton'
import Button from '../../../../../../components/ButtonsAndInputs/Button'

interface CalendarHeaderProps {
  label: string
  view: View
  onNavigate: (direction: NavigateAction) => void
  onView: (view: View) => void
  setModifyEventModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  label,
  view: currentView,
  onNavigate,
  onView,
  setModifyEventModalOpenType
}) => (
  <div className="mb-4 flex w-full items-end justify-between">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <NavigationButton direction="PREV" onNavigate={onNavigate} />
        <NavigationButton direction="NEXT" onNavigate={onNavigate} />
      </div>
      <div className="text-center text-2xl font-bold">{label}</div>
    </div>
    <div className="flex gap-4">
      <div className="flex gap-1 rounded-md bg-bg-50 p-2 shadow-custom dark:bg-bg-900">
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
        icon="tabler:plus"
        onClick={() => {
          setModifyEventModalOpenType('create')
        }}
      >
        Add Event
      </Button>
    </div>
  </div>
)

export default CalendarHeader
