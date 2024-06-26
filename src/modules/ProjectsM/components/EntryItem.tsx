import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { Link } from 'react-router-dom'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import { type IProjectsMEntry } from '@interfaces/projects_m_interfaces'
import { useProjectsMContext } from '@providers/ProjectsMProvider'

function EntryItem({ entry }: { entry: IProjectsMEntry }): React.ReactElement {
  const {
    entries: {
      setExistedData,
      setModifyDataModalOpenType,
      setDeleteDataConfirmationOpen
    },
    categories: { data: categories },
    statuses: { data: statuses },
    visibilities: { data: visibilities },
    technologies: { data: technologies }
  } = useProjectsMContext()
  return (
    <li className="m-4 mt-0 flex items-center gap-4 rounded-lg bg-bg-50 p-6 shadow-custom dark:bg-bg-900">
      <Link
        to={`/projects-m/${entry.id}`}
        className="flex w-full flex-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div
            className="h-10 w-1 shrink-0 rounded-full"
            style={{
              backgroundColor:
                typeof statuses !== 'string'
                  ? statuses.find(l => l.id === entry.status)?.color
                  : ''
            }}
          />
          <div
            className="size-12 shrink-0 overflow-hidden rounded-lg p-2"
            style={{
              backgroundColor: entry.color + '20',
              color: entry.color
            }}
          >
            <Icon icon={entry.icon} className="size-full" />
          </div>
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 font-semibold">
              {entry.name}

              {typeof visibilities !== 'string' && (
                <Icon
                  icon={
                    visibilities.find(l => l.id === entry.visibility)?.icon ??
                    'tabler:eye'
                  }
                  className="size-4"
                />
              )}
            </div>
            <div className="text-sm text-bg-500">
              {typeof categories !== 'string' &&
                categories.find(l => l.id === entry.category)?.name}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {typeof technologies !== 'string' &&
              entry.technologies.map(tech => {
                const technology = technologies.find(l => l.id === tech)
                return (
                  <Icon
                    key={technology?.id}
                    icon={technology?.icon ?? 'tabler:code'}
                    className="size-6"
                  />
                )
              })}
          </div>
          <HamburgerMenu className="relative">
            <MenuItem
              text="Edit"
              icon="tabler:edit"
              onClick={() => {
                setExistedData(entry)
                setModifyDataModalOpenType('update')
              }}
            />
            <MenuItem
              text="Delete"
              icon="tabler:trash"
              onClick={() => {
                setExistedData(entry)
                setDeleteDataConfirmationOpen(true)
              }}
              isRed
            />
          </HamburgerMenu>
        </div>
      </Link>
    </li>
  )
}

export default EntryItem
