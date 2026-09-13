import { useModuleTranslation } from '@lifeforge/localization'
import { Icon, WithQuery } from '@lifeforge/ui'

import { useIdeaBoxContext } from '@/providers/IdeaBoxProvider'

import FolderItem from './components/FolderItem'

function FolderList() {
  const { t } = useModuleTranslation()
  const { foldersQuery } = useIdeaBoxContext()

  return (
    <>
      <h2 className="text-bg-500 mb-2 flex items-center gap-2 text-lg font-medium">
        <Icon className="size-6" icon="tabler:folder" />
        {t('entryType.folder')}
      </h2>
      <WithQuery query={foldersQuery}>
        {folders => (
          <div className="mt-2 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {folders.map(folder => (
              <FolderItem key={folder.id} folder={folder} />
            ))}
          </div>
        )}
      </WithQuery>
    </>
  )
}

export default FolderList
