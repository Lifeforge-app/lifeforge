import { SidebarItem } from 'lifeforge-ui'
import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

function SidebarAuthorItem({
  author,
  count,
  isActive,
  onCancel,
  onSelect
}: {
  author: string | null
  count: number
  isActive: boolean
  onCancel: () => void
  onSelect: (author: string | null) => void
}) {
  const { t } = useTranslation('apps.scoresLibrary')

  const handleClick = useCallback(() => {
    onSelect(author || '[na]')
  }, [])

  return (
    <SidebarItem
      active={isActive}
      autoActive={false}
      icon="tabler:user"
      label={author || t('unknownAuthor')}
      number={count}
      onCancelButtonClick={onCancel}
      onClick={handleClick}
    />
  )
}

export default memo(SidebarAuthorItem, (prevProps, nextProps) => {
  return (
    prevProps.author === nextProps.author &&
    prevProps.count === nextProps.count &&
    prevProps.isActive === nextProps.isActive
  )
})
