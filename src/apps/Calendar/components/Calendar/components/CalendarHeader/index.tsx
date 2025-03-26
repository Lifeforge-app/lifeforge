import { memo } from 'react'
import { type NavigateAction, type View } from 'react-big-calendar'
import { useTranslation } from 'react-i18next'

import { Button } from '@lifeforge/ui'

import NavigationControl from './components/NavigationControl'
import ViewSelector from './components/ViewSelector'

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
}: CalendarHeaderProps) {
  const { t } = useTranslation('apps.calendar')

  return (
    <div className="mb-4 flex w-full flex-col items-end justify-between gap-4 lg:flex-row">
      <NavigationControl label={label} onNavigate={onNavigate} />
      <div className="flex w-full gap-4 lg:w-auto">
        <ViewSelector currentView={currentView} onView={onView} />
        <Button
          className="hidden whitespace-nowrap lg:flex"
          icon="tabler:plus"
          tProps={{ item: t('items.event') }}
          onClick={() => {
            setModifyEventModalOpenType('create')
          }}
        >
          new
        </Button>
      </div>
    </div>
  )
}

export default memo(CalendarHeader)
