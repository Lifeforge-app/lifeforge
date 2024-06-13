import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function TodaysEvent(): React.ReactElement {
  const { t } = useTranslation()

  return (
    <div className="flex size-full flex-col gap-4 rounded-lg bg-bg-50 p-6 shadow-custom dark:bg-bg-900">
      <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold">
        <Icon icon="tabler:calendar" className="text-2xl" />
        <span className="ml-2">{t('dashboard.modules.todayEvent.title')}</span>
      </h1>
      <ul className="flex h-full flex-col gap-4 overflow-y-auto">
        <li className="flex flex-1 items-center justify-between gap-4 rounded-lg bg-bg-100 p-4 shadow-[4px_4px_10px_rgba(0,0,0,0.1)] dark:bg-bg-800">
          <div className="h-full w-1.5 rounded-full bg-rose-500" />
          <div className="flex w-full flex-col gap-1">
            <div className="font-semibold ">Coldplay&apos;s concert</div>
            <div className="text-sm text-bg-500">8:00 PM</div>
          </div>
        </li>
        <li className="flex flex-1 items-center justify-between gap-4 rounded-lg bg-bg-100 p-4 shadow-[4px_4px_10px_rgba(0,0,0,0.1)] dark:bg-bg-800">
          <div className="h-full w-1.5 rounded-full bg-purple-500" />
          <div className="flex w-full flex-col gap-1">
            <div className="font-semibold ">Meeting with client</div>
            <div className="text-sm text-bg-500">10:00 PM</div>
          </div>
        </li>
        <li className="flex flex-1 items-center justify-between gap-4 rounded-lg bg-bg-100 p-4 shadow-[4px_4px_10px_rgba(0,0,0,0.1)] dark:bg-bg-800">
          <div className="h-full w-1.5 rounded-full bg-purple-500" />
          <div className="flex w-full flex-col gap-1">
            <div className="font-semibold ">Deadline for project</div>
            <div className="text-sm text-bg-500">11:59 PM</div>
          </div>
        </li>
      </ul>
    </div>
  )
}
