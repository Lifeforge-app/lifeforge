import { useQuery } from '@tanstack/react-query'
import { AutoSizer } from 'react-virtualized'

import {
  Box,
  EmptyStateScreen,
  Flex,
  Grid,
  Scrollbar,
  WithQuery
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import { TGVTabbedView } from '..'
import TGVMovieItem from './TGVMovieItem'

function TGVMovieList() {
  const { currentTab } = TGVTabbedView.useContext()

  const moviesQuery = useQuery(
    forgeAPI.tgv.list.input({ type: currentTab }).queryOptions()
  )

  const entriesQuery = useQuery(forgeAPI.entries.list.queryOptions())

  const existingTgvIds = new Set(
    entriesQuery.data?.entries.filter(e => e.tgv_id).map(e => e.tgv_id) ?? []
  )

  return (
    <Flex centered direction="column" flex="1" minHeight="0" mt="md">
      <WithQuery query={moviesQuery}>
        {data => {
          if (data.movies.length === 0) {
            return (
              <Box height="24rem">
                <EmptyStateScreen
                  icon="tabler:movie-off"
                  message={{
                    id: 'search'
                  }}
                />
              </Box>
            )
          }

          return (
            <Box flex="1" height="100%" minHeight="0" width="100%">
              <AutoSizer>
                {({ width, height }) => (
                  <Scrollbar
                    style={{
                      width,
                      height
                    }}
                  >
                    <Grid
                      gap="sm"
                      pb="md"
                      templateCols={{
                        base: 1,
                        sm: 'repeat(auto-fill, minmax(20rem, 1fr))'
                      }}
                    >
                      {data.movies.map(movie => (
                        <TGVMovieItem
                          key={movie.itemkey}
                          data={movie}
                          isAdded={existingTgvIds.has(movie.recid)}
                          tab={currentTab}
                        />
                      ))}
                    </Grid>
                  </Scrollbar>
                )}
              </AutoSizer>
            </Box>
          )
        }}
      </WithQuery>
    </Flex>
  )
}

export default TGVMovieList
