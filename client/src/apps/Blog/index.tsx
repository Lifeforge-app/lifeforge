import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  Button,
  EmptyStateScreen,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper
} from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

function Blog() {
  const { t } = useTranslation('apps.blog')

  const entriesQuery = useQuery(forgeAPI.blog.entries.list.queryOptions())

  return (
    <ModuleWrapper>
      <ModuleHeader
        actionButton={
          <Button
            as={Link}
            icon="tabler:plus"
            to="/blog/compose"
            tProps={{
              item: t('items.post')
            }}
            variant="primary"
          >
            New
          </Button>
        }
        icon="tabler:pencil-heart"
        title="Blog"
      />
      <QueryWrapper query={entriesQuery}>
        {entries =>
          entries.length > 0 ? (
            <></>
          ) : (
            <EmptyStateScreen
              icon="tabler:article-off"
              name="entries"
              namespace="apps.blog"
            />
          )
        }
      </QueryWrapper>
    </ModuleWrapper>
  )
}

export default Blog
