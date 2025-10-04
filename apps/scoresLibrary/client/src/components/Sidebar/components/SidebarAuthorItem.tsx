import useFilter from '@/hooks/useFilter'
import { SidebarItem } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

function SidebarAuthorItem({
  author,
  count,
  isActive
}: {
  author: string | null
  count: number
  isActive: boolean
}) {
  const { t } = useTranslation('apps.scoresLibrary')

  const { updateFilter } = useFilter()

  return (
    <SidebarItem
      active={isActive}
      autoActive={false}
      icon="tabler:user"
      label={author || t('unknownAuthor')}
      number={count}
      onCancelButtonClick={() => updateFilter('author', null)}
      onClick={() => updateFilter('author', author || '[na]')}
    />
  )
}

export default SidebarAuthorItem
