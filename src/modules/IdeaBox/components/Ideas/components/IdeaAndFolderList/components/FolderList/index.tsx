import { Icon } from '@iconify/react/dist/iconify.js'
import { t } from 'i18next'
import React from 'react'
import { type IIdeaBoxFolder } from '@interfaces/ideabox_interfaces'
import { useIdeaBoxContext } from '@providers/IdeaBoxProvider'
import FolderItem from './components/FolderItem'

function FolderList(): React.ReactElement {
  const { folders } = useIdeaBoxContext()
  return (
    <>
      <h2 className="mb-2 flex items-center gap-2 text-lg font-medium text-bg-500">
        <Icon icon="tabler:folder" className="size-6" />
        {t('ideaBox.entryType.folder')}
      </h2>
      <div className="mt-2 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        {(folders as IIdeaBoxFolder[]).map(folder => (
          <FolderItem key={folder.id} folder={folder} />
        ))}
      </div>
    </>
  )
}

export default FolderList
