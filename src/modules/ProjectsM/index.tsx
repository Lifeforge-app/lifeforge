import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, FAB } from '@components/buttons'
import { SearchInput } from '@components/inputs'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import Scrollbar from '@components/utilities/Scrollbar'
import { useProjectsMContext } from '@providers/ProjectsMProvider'
import EntryItem from './components/EntryItem'
import ModifyEntryModal from './components/ModifyEntryModal'
import ModifyModal from './components/ModifyModal'
import Sidebar from './components/Sidebar'

function ProjectsM(): React.ReactElement {
  const { t } = useTranslation('modules.projectsM')
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
      <ModuleHeader icon="tabler:clipboard" title="Projects M" />
      <div className="mt-6 flex size-full min-h-0 flex-1">
        <Sidebar />
        <div className="relative z-10 flex h-full flex-1 flex-col xl:ml-8">
          <div className="flex-between flex">
            <h1 className="text-3xl font-semibold lg:text-4xl">
              All Projects <span className="text-base text-bg-500">(10)</span>
            </h1>
            <div className="flex items-center gap-6">
              <Button
                className="hidden sm:flex"
                icon="tabler:plus"
                tProps={{
                  item: t('items.project')
                }}
                onClick={() => {
                  setModifyDataModalOpenType('create')
                  setExistedData(null)
                }}
              >
                new
              </Button>
              <Button
                className="xl:hidden"
                icon="tabler:menu"
                variant="no-bg"
                onClick={() => {
                  setSidebarOpen(true)
                }}
              />
            </div>
          </div>
          <SearchInput
            namespace="modules.projectsM"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            stuffToSearch="project"
          />
          <div className="mt-6 flex flex-1 flex-col">
            <APIFallbackComponent data={entries}>
              {entries =>
                entries.length === 0 ? (
                  <Scrollbar>
                    <ul className="mb-8 flex flex-col">
                      {entries.map(entry => (
                        <EntryItem key={entry.id} entry={entry} />
                      ))}
                    </ul>
                  </Scrollbar>
                ) : (
                  <EmptyStateScreen
                    icon="tabler:clipboard-off"
                    name="projects"
                    namespace="modules.projectsM"
                  />
                )
              }
            </APIFallbackComponent>
          </div>
        </div>
      </div>
      <FAB
        hideWhen="sm"
        onClick={() => {
          setModifyDataModalOpenType('create')
          setExistedData(null)
        }}
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
          data={config.data}
          isOpen={config.isOpen}
          itemName={config.itemName}
          nameKey={config.nameKey}
          updateDataLists={config.updateDataList}
          onClose={() => {
            config.setOpen(false)
            config.setData(null)
          }}
        />
      ))}
    </ModuleWrapper>
  )
}

export default ProjectsM
