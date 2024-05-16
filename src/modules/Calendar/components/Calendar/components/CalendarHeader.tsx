/* eslint-disable @typescript-eslint/indent */
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import Button from '@components/Button'

export default function CalendarHeader({
  label,
  view: currentView,
  onNavigate,
  onView,
  setModifyEventModalOpenType
}: {
  label: string
  view: 'month' | 'week' | 'day' | 'agenda' | 'work_week'
  onNavigate: (direction: 'PREV' | 'NEXT') => void
  onView: (view: 'month' | 'week' | 'day' | 'agenda' | 'work_week') => void
  setModifyEventModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
}): React.ReactElement {
  return (
    <div className="mb-4 flex w-full items-end justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            onNavigate('PREV')
          }}
          className="rounded-md p-2 text-bg-500 transition-all hover:bg-bg-900"
        >
          <Icon icon="uil:angle-left" className="h-6 w-6" />
        </button>
        <div className="text-center text-2xl font-bold">{label}</div>
        <button
          onClick={() => {
            onNavigate('NEXT')
          }}
          className="rounded-md p-2 text-bg-500 transition-all hover:bg-bg-900"
        >
          <Icon icon="uil:angle-right" className="h-6 w-6" />
        </button>
      </div>
      <div className="flex gap-4">
        <div className="flex gap-1 rounded-md bg-bg-900 p-2">
          {['Month', 'Week', 'Day', 'Agenda'].map(view => (
            <button
              key={view}
              onClick={() => {
                onView(
                  view.toLowerCase() as 'month' | 'week' | 'day' | 'agenda'
                )
              }}
              className={`rounded-md p-2 px-4 transition-all hover:bg-bg-800 ${
                view.toLowerCase() === currentView
                  ? 'bg-bg-800 text-bg-200'
                  : 'text-bg-500'
              }`}
            >
              {view}
            </button>
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
}
