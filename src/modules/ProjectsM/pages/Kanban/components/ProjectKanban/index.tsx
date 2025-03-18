import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'

import {
  DeleteConfirmationModal,
  HamburgerMenu,
  MenuItem,
  QueryWrapper,
  Scrollbar
} from '@lifeforge/ui'

import { type IProjectsMKanbanColumn } from '@modules/ProjectsM/interfaces/projects_m_interfaces'

import useAPIQuery from '@hooks/useAPIQuery'
import useComponentBg from '@hooks/useComponentBg'

import AddCardButton from './modals/AddCardButton'
import ModifyCardModal from './modals/ModifyCardModal'
import ModifyColumnsModal from './modals/ModifyColumnModal'

function ProjectKanban() {
  const { componentBg } = useComponentBg()
  const { id } = useParams()
  const columnsQuery = useAPIQuery<IProjectsMKanbanColumn[]>(
    `projects-m/kanban/columns/${id}`,
    ['projects-m', 'kanban', 'columns', id]
  )
  const [modifyColumnModalOpenType, setModifyColumnModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [modifyCardModalOpenType, setModifyCardModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [
    deleteColumnConfirmationModalOpen,
    setDeleteColumnConfirmationModalOpen
  ] = useState(false)
  const [existedData, setExistedData] = useState<IProjectsMKanbanColumn | null>(
    null
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerHeight, setContainerHeight] = useState<number>(0)

  useEffect(() => {
    if (containerRef.current !== null) {
      setContainerHeight(containerRef.current.clientHeight)
    }
  }, [columnsQuery.data])

  return (
    <>
      <QueryWrapper query={columnsQuery}>
        {columns => (
          <Scrollbar>
            <div
              ref={containerRef}
              className="mb-8 mt-6 flex h-full min-h-0 min-w-0 flex-1 gap-4"
            >
              {columns.map((column, id) => (
                <div
                  key={id}
                  className={clsx(
                    'flex h-min max-h-full w-96 shrink-0 flex-col rounded-lg border-t-4 p-6 pb-0 pr-4',
                    componentBg
                  )}
                  style={{
                    borderColor: column.color
                  }}
                >
                  <div className="flex-between flex">
                    <h3 className="flex items-center gap-4">
                      <Icon className="text-2xl" icon={column.icon} />
                      <span className="text-xl font-semibold">
                        {column.name}
                      </span>
                    </h3>
                    <HamburgerMenu>
                      <MenuItem
                        icon="tabler:pencil"
                        text="Edit"
                        onClick={() => {
                          setModifyColumnModalOpenType('update')
                          setExistedData(column)
                        }}
                      />
                      <MenuItem
                        isRed
                        icon="tabler:trash"
                        text="Delete"
                        onClick={() => {
                          setDeleteColumnConfirmationModalOpen(true)
                          setExistedData(column)
                        }}
                      />
                    </HamburgerMenu>
                  </div>
                  <Scrollbar
                    autoHeight
                    autoHeightMax={containerHeight - 86}
                    className="mt-6"
                  >
                    <ul className="h-full space-y-2 pr-2">
                      {column.entries?.map(entry => (
                        <li
                          key={entry.id}
                          className="bg-bg-100 hover:bg-bg-700/50 dark:bg-bg-700/30 flex items-center gap-4 rounded-lg p-4 shadow-[2px_2px_3px_rgba(0,0,0,0.05)]"
                        >
                          <span className="">{entry.title}</span>
                        </li>
                      ))}
                      <AddCardButton />
                    </ul>
                  </Scrollbar>
                </div>
              ))}
              <button
                className="border-bg-400 text-bg-500 hover:border-bg-800 hover:bg-bg-200 dark:border-bg-500 dark:hover:border-bg-100 dark:hover:bg-bg-800/20 dark:hover:text-bg-50 flex h-min max-h-full w-72 shrink-0 flex-col items-center gap-2 rounded-lg border-2 border-dashed p-8 transition-all"
                onClick={() => {
                  setModifyColumnModalOpenType('create')
                  setExistedData(null)
                }}
              >
                <Icon className="text-4xl" icon="tabler:plus" />
                <span className="text-xl font-semibold">Add a column</span>
              </button>
            </div>
          </Scrollbar>
        )}
      </QueryWrapper>
      <ModifyColumnsModal
        existedData={existedData}
        openType={modifyColumnModalOpenType}
        refreshColumns={() => {
          columnsQuery.refetch()
        }}
        setExistedData={setExistedData}
        setOpenType={setModifyColumnModalOpenType}
      />
      <ModifyCardModal
        openType={modifyCardModalOpenType}
        setOpenType={setModifyCardModalOpenType}
      />
      <DeleteConfirmationModal
        apiEndpoint="projects-m/kanban/columns"
        data={existedData}
        isOpen={deleteColumnConfirmationModalOpen}
        itemName="column"
        nameKey="name"
        updateDataList={() => {
          columnsQuery.refetch()
        }}
        onClose={() => {
          setDeleteColumnConfirmationModalOpen(false)
        }}
      />
    </>
  )
}

export default ProjectKanban
