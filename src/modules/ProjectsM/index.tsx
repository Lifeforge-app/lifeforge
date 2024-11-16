import { t } from 'i18next'
import React from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import FAB from '@components/ButtonsAndInputs/FAB'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import Scrollbar from '@components/Miscellaneous/Scrollbar'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import { useProjectsMContext } from '@providers/ProjectsMProvider'
import EntryItem from './components/EntryItem'
import ModifyEntryModal from './components/ModifyEntryModal'
import ModifyModal from './components/ModifyModal'
import Sidebar from './components/Sidebar'

function ProjectsM(): React.ReactElement {
  const {
    miscellaneous: {
      deleteModalConfigs,
      searchQuery,
      setSearchQuery,
      setSidebarOpen
    },
    entries: { data: entries, setModifyDataModalOpenType, setExistedData }
  } = useProjectsMContext()

  return (
    <ModuleWrapper>
      <ModuleHeader icon="tabler:clipboard" title="Projects (M)" />
      <div className="mt-6 flex size-full min-h-0 flex-1">
        <Sidebar />
        <div className="relative z-10 flex h-full flex-1 flex-col xl:ml-8">
          <div className="flex-between flex">
            <h1 className="text-3xl font-semibold lg:text-4xl">
              All Projects <span className="text-base text-bg-500">(10)</span>
            </h1>
            <div className="flex items-center gap-6">
              <Button
                onClick={() => {
                  setModifyDataModalOpenType('create')
                  setExistedData(null)
                }}
                className="hidden sm:flex"
                icon="tabler:plus"
              >
                new project
              </Button>
              <Button
                onClick={() => {
                  setSidebarOpen(true)
                }}
                variant="no-bg"
                icon="tabler:menu"
                className="xl:hidden"
              />
            </div>
          </div>
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            stuffToSearch="projects"
          />
          <div className="mt-6 flex flex-1 flex-col">
            <APIComponentWithFallback data={entries}>
              {entries =>
                entries.length > 0 ? (
                  <Scrollbar>
                    <ul className="mb-8 flex flex-col">
                      {entries.map(entry => (
                        <EntryItem key={entry.id} entry={entry} />
                      ))}
                    </ul>
                  </Scrollbar>
                ) : (
                  <EmptyStateScreen
                    title={t('emptyState.projects.title')}
                    description={t('emptyState.projects.description')}
                    icon="tabler:clipboard-off"
                    ctaContent="New Project"
                  />
                )
              }
            </APIComponentWithFallback>
          </div>
        </div>
      </div>
      <FAB
        onClick={() => {
          setModifyDataModalOpenType('create')
          setExistedData(null)
        }}
        hideWhen="sm"
      />
      <ModifyEntryModal />
      {(
        ['statuses', 'categories', 'visibilities', 'technologies'] as const
      ).map((stuff, index) => (
        <ModifyModal key={index} stuff={stuff} />
      ))}
      {deleteModalConfigs.map((config, index) => (
        <DeleteConfirmationModal
          key={index}
          apiEndpoint={config.apiEndpoint}
          isOpen={config.isOpen}
          data={config.data}
          itemName={config.itemName}
          nameKey={config.nameKey}
          onClose={() => {
            config.setOpen(false)
            config.setData(null)
          }}
          updateDataList={config.updateDataList}
        />
      ))}
    </ModuleWrapper>
  )
}

export default ProjectsM
