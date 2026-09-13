import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  EmptyStateScreen,
  ModuleHeader,
  WithQuery
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

function Blog() {
  const { t } = useModuleTranslation()
  const entriesQuery = useQuery(forgeAPI.blog.entries.list.queryOptions())

  return (
    <>
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
      />
      <WithQuery query={entriesQuery}>
        {entries =>
          entries.length > 0 ? (
            <></>
          ) : (
            <EmptyStateScreen
              icon="tabler:article-off"
              message={{
                id: 'entries',
                namespace: 'apps.blog'
              }}
            />
          )
        }
      </WithQuery>
    </>
  )
}

export default Blog
