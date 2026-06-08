/* eslint-disable react-compiler/react-compiler */
import mdxListCounts from 'virtual:mdx-list-counts'

import { Box, WithDivide } from '@lifeforge/ui'

import { components } from '@/components/MdxComponents'

import Version from './Version'

const compiledModules = import.meta.glob('../versions/**/*.mdx', {
  eager: true
}) as Record<
  string,
  { default: React.ComponentType<{ components: typeof components }> }
>

const entries = Object.entries(
  Object.groupBy(
    Object.entries(compiledModules),
    ([path]) => path.match(/\.\.\/versions\/(\d+)\/.*/)![1]
  )
)
  .sort((a, b) => Number(b[0]) - Number(a[0]))
  .map(([year, modules]) => ({
    year: Number(year),
    versions: modules!
      .map(([path, module]) => ({
        week: Number(path.match(/\.\.\/versions\/\d+\/(\d+)\.mdx/)![1]),
        Component: module.default,
        liCount: mdxListCounts[path] ?? 0
      }))
      .sort((a, b) => b.week - a.week)
  }))

function ChangelogEntries() {
  let isFirst = true

  return (
    <Box>
      {entries.map(({ year, versions }) =>
        versions.map(({ week, Component, liCount }) => {
          const first = isFirst

          isFirst = false

          return (
            <WithDivide key={`${year}-week-${week}`}>
              <Version
                isLatest={first}
                liCount={liCount}
                week={week}
                year={year}
              >
                <Component components={components} />
              </Version>
            </WithDivide>
          )
        })
      )}
    </Box>
  )
}

export default ChangelogEntries
