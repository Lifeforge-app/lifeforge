import { Icon } from '@iconify/react'
import { useIdeaBoxContext } from '@providers/IdeaBoxProvider'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { type IIdeaBoxFolder } from '@interfaces/ideabox_interfaces'

import FolderItem from './components/FolderItem'

function FolderList(): React.ReactElement {
  const { t } = useTranslation('modules.ideaBox')
  const { folders } = useIdeaBoxContext()

  return (
    <>
      <h2 className="text-bg-500 mb-2 flex items-center gap-2 text-lg font-medium">
        <Icon className="size-6" icon="tabler:folder" />
        {t('entryType.folder')}
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
