/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { Icon } from '@iconify/react'
import moment from 'moment'
import React from 'react'
import { Link } from 'react-router-dom'
import { type IProjectsKEntry } from '@typedec/ProjectK'
import { PROJECT_STATUS } from '..'

function ProjectList({
  filteredProjectList
}: {
  filteredProjectList: IProjectsKEntry[]
}): React.ReactElement {
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(30%,1fr))] gap-4 px-4">
      {filteredProjectList.map(project => (
        <li
          key={project.id}
          className="relative flex h-min w-full flex-col gap-4 overflow-hidden rounded-lg bg-bg-50 p-4 shadow-custom dark:bg-bg-900"
        >
          <div className="relative w-full overflow-hidden rounded-lg">
            <div className="flex-center relative flex aspect-square h-auto w-full rounded-md bg-bg-200/50 dark:bg-bg-800">
              {project.thumbnail ? (
                <img
                  src={`${import.meta.env.VITE_API_HOST}/media/${
                    project.collectionId
                  }/${project.id}/${project.thumbnail}?thumb=0x500`}
                  className="aspect-square h-auto w-full rounded-md object-contain"
                />
              ) : (
                <Icon
                  icon="tabler:brush"
                  className="h-32 w-32 text-bg-300 dark:text-bg-700"
                />
              )}
            </div>
            <div className="mt-4 flex items-start justify-between ">
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-1 shrink-0 rounded-full ${
                    PROJECT_STATUS[project.status].bg
                  }`}
                />
                <div className="flex w-full flex-col">
                  <h3 className="text-xl font-semibold text-bg-800 dark:text-bg-100">
                    {project.name}
                  </h3>
                  <p className="text-sm text-bg-500">{project.customer_name}</p>
                </div>
              </div>
              <div className="relative z-[9999]">{/* <HamburgerMenu /> */}</div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Icon
                icon={
                  project.type === 'personal'
                    ? 'tabler:currency-dollar-off'
                    : 'tabler:currency-dollar'
                }
                className="h-5 w-5 text-bg-500"
              />
              <span className="text-sm text-bg-500">
                {project.type === 'personal' ? 'Personal' : 'Commercial'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="tabler:credit-card" className="h-5 w-5 text-bg-500" />
              <span className="text-sm text-bg-500">
                {project.payment_status
                  ? project.payment_status.fully_paid
                    ? 'Fully Paid'
                    : project.payment_status.deposit_paid
                    ? 'Deposit Paid'
                    : 'Unpaid'
                  : 'N/A'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Icon
                icon="tabler:calendar-event"
                className="h-5 w-5 text-bg-500"
              />
              <span className="text-sm text-bg-500">
                {moment(project.created).format('DD MMM YYYY')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="tabler:versions" className="h-5 w-5 text-bg-500" />
              <span className="text-sm text-bg-500">
                {project.files.length} files
              </span>
            </div>
          </div>
          <progress
            value={project.progress.completed / project.progress.steps.length}
            max={1}
            className="mt-4 h-1 w-full rounded-lg bg-bg-200 dark:bg-bg-800"
          />
          <span className="-mt-2 text-xs text-bg-500">
            {(project.progress.completed / project.progress.steps.length) * 100}
            % completed
          </span>
          <Link
            to={`/projects-k/${project.id}`}
            className="absolute left-0 top-0 h-full w-full transition-colors hover:bg-bg-100/[0.02]"
          />
        </li>
      ))}
    </ul>
  )
}

export default ProjectList
