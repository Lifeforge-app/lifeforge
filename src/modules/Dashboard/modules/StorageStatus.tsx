/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import { type IDiskUsage } from '@typedec/ServerStatus'

export default function StorageStatus(): React.ReactElement {
  const { t } = useTranslation()
  const [diskUsage] = useFetch<IDiskUsage[]>('server/disks')

  return (
    <section className="col-span-1 flex w-full flex-col gap-4 rounded-lg bg-bg-50 p-6 shadow-custom dark:bg-bg-900">
      <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold">
        <Icon icon="tabler:server" className="text-2xl" />
        <span className="ml-2">
          {t('dashboard.modules.storageStatus.title')}
        </span>
      </h1>
      <APIComponentWithFallback data={diskUsage}>
        {typeof diskUsage !== 'string' && (
          <div className="-mt-4 flex max-h-96 flex-col divide-y divide-bg-200 overflow-y-auto dark:divide-bg-700">
            {diskUsage.map(disk => (
              <div key={disk.name} className="flex flex-col gap-4 py-6">
                <div className="flex w-full min-w-0 items-center justify-between">
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <Icon
                      icon="streamline:hard-disk"
                      className="text-xl text-bg-500"
                    />
                    <h2 className="mr-4 min-w-0 truncate text-bg-500">
                      {disk.name}
                    </h2>
                  </div>
                  <p className="shrink-0 rounded-md border border-bg-200 px-4 py-2 text-sm text-bg-500 dark:border-bg-500">
                    {disk.size}B
                  </p>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-bg-200 dark:bg-bg-800">
                  <div
                    className="h-full rounded-full bg-custom-500"
                    style={{ width: disk.usedPercent }}
                  ></div>
                </div>
                <div className="-mt-2 flex items-center justify-between">
                  <p className="text-sm text-bg-500">
                    {disk.used}B / {disk.size}B
                  </p>
                  <p className="text-sm text-bg-500">{disk.usedPercent} used</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </APIComponentWithFallback>
    </section>
  )
}
