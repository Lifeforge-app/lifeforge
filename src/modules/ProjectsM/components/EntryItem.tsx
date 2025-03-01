import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'
import { Link } from 'react-router'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import useThemeColors from '@hooks/useThemeColor'
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
  const { componentBgWithHover } = useThemeColors()

  return (
    <li
      className={clsx(
        'm-4 mt-0 flex items-center gap-4 rounded-lg shadow-custom transition-all',
        componentBgWithHover
      )}
    >
      <Link
        className="flex-between flex w-full gap-4 p-6"
        to={`/projects-m/${entry.id}`}
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
            <Icon className="size-full" icon={entry.icon} />
          </div>
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 font-semibold">
              {entry.name}

              {typeof visibilities !== 'string' && (
                <Icon
                  className="size-4"
                  icon={
                    visibilities.find(l => l.id === entry.visibility)?.icon ??
                    'tabler:eye'
                  }
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
                    className="size-6"
                    icon={technology?.icon ?? 'tabler:code'}
                  />
                )
              })}
          </div>
          <HamburgerMenu className="relative">
            <MenuItem
              icon="tabler:pencil"
              text="Edit"
              onClick={() => {
                setExistedData(entry)
                setModifyDataModalOpenType('update')
              }}
            />
            <MenuItem
              isRed
              icon="tabler:trash"
              text="Delete"
              onClick={() => {
                setExistedData(entry)
                setDeleteDataConfirmationOpen(true)
              }}
            />
          </HamburgerMenu>
        </div>
      </Link>
    </li>
  )
}

export default EntryItem
