/* eslint-disable multiline-ternary */
import React from 'react'
import ModuleHeader from '../../components/ModuleHeader'
import { Icon } from '@iconify/react'

import data from './data.json'

export default function UniversityAnalytics(): React.JSX.Element {
  return (
    <section className="flex h-full min-h-0 w-full flex-1 flex-col px-12">
      <ModuleHeader
        title="University Analytics"
        desc="See which universities are the best for you."
      />
      <div className="mt-6 flex w-full flex-1 flex-col gap-6 overflow-y-auto pb-6">
        {data.items.map(item => (
          <div
            key={item.c.id}
            className="flex w-full items-center justify-between gap-6 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 p-6"
          >
            <div className="flex items-center gap-6">
              <div className="bg-white outline outline-2 outline-offset-4 outline-teal-500">
                <img
                  src={item.u.logo}
                  alt=""
                  className="h-20 w-20 object-contain"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold">{item.c.name}</h2>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-neutral-100">
                    <Icon icon="tabler:school" className="text-xl" />
                    <span className="font-medium">{item.u.campus_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-100">
                    <Icon icon="tabler:map-pin" className="text-xl" />
                    <span className="font-medium">{item.u.campus_name}</span>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  {item.u.badges.map(
                    badge =>
                      badge.name !== '' && (
                        <div
                          key={badge.name}
                          className={
                            'flex items-center gap-2 rounded-full bg-teal-500/20 px-4 py-1.5 text-xs font-medium text-teal-500'
                          }
                        >
                          {badge.name}
                        </div>
                      )
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <div
                  className={`text-2xl font-semibold ${
                    item.c.nett_fee.startsWith('-') && 'text-green-500'
                  }`}
                >
                  RM {item.c.avg_nett_fee.toLocaleString()}
                </div>
                <span className="text-lg font-medium text-neutral-100">
                  {item.c.nett_fee.startsWith('-') ? 'surplus ' : ''}/ year
                </span>
              </div>
              <Icon
                icon="tabler:chevron-right"
                className="h-5 w-5 text-neutral-400"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
