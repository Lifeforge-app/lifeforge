import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import Scrollbar from '@components/utilities/Scrollbar'
import useFetch from '@hooks/useFetch'
import useThemeColors from '@hooks/useThemeColor'
import { type IProjectsMKanbanColumn } from '@interfaces/projects_m_interfaces'
import AddCardButton from './modals/AddCardButton'
import ModifyCardModal from './modals/ModifyCardModal'
import ModifyColumnsModal from './modals/ModifyColumnModal'

function ProjectKanban(): React.ReactElement {
  const { componentBg } = useThemeColors()
  const { id } = useParams()
  const [columns, refreshColumns] = useFetch<IProjectsMKanbanColumn[]>(
    `projects-m/kanban/column/${id}`
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
  }, [columns])

  return (
    <>
      <APIFallbackComponent data={columns}>
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
                      <span className="text-xl font-semibold ">
                        {column.name}
                      </span>
                    </h3>
                    <HamburgerMenu className="relative">
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
                          className="flex items-center gap-4 rounded-lg bg-bg-100 p-4 shadow-[2px_2px_3px_rgba(0,0,0,0.05)] hover:bg-bg-700/50 dark:bg-bg-700/30"
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
                className="flex h-min max-h-full w-72 shrink-0 flex-col items-center gap-2 rounded-lg border-2 border-dashed border-bg-400 p-8 text-bg-500 transition-all  hover:border-bg-800 hover:bg-bg-200 dark:border-bg-500 dark:hover:border-bg-100 dark:hover:bg-bg-800/20 dark:hover:text-bg-50"
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
      </APIFallbackComponent>
      <ModifyColumnsModal
        existedData={existedData}
        openType={modifyColumnModalOpenType}
        refreshColumns={refreshColumns}
        setExistedData={setExistedData}
        setOpenType={setModifyColumnModalOpenType}
      />
      <ModifyCardModal
        openType={modifyCardModalOpenType}
        setOpenType={setModifyCardModalOpenType}
      />
      <DeleteConfirmationModal
        apiEndpoint="projects-m/kanban/column"
        data={existedData}
        isOpen={deleteColumnConfirmationModalOpen}
        itemName="column"
        nameKey="name"
        updateDataList={refreshColumns}
        onClose={() => {
          setDeleteColumnConfirmationModalOpen(false)
        }}
      />
    </>
  )
}

export default ProjectKanban
