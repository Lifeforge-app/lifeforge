import { components } from '@/components/MdxComponents'

import Version from './Version'

const entries = Object.entries(
  Object.groupBy(
    Object.entries(import.meta.glob('../versions/**/*.mdx', { eager: true })),
    ([path]) => path.match(/\.\.\/versions\/(\d+)\/.*/)![1]
  )
)
  .sort((a, b) => Number(b[0]) - Number(a[0]))
  .map(([year, modules]) => ({
    year: Number(year),
    versions: modules!
      .map(([path, module]) => ({
        week: Number(path.match(/\.\.\/versions\/\d+\/(\d+)\.mdx/)![1]),
        Component: (module as any).default
      }))
      .sort((a, b) => b.week - a.week)
  }))

function ChangelogEntries() {
  return (
    <>
      {entries.map(({ year, versions }) =>
        versions.map(({ week, Component }) => (
          <Version key={`${year}-week-${week}`} week={week} year={year}>
            <Component components={components} />
          </Version>
        ))
      )}
    </>
  )
}

export default ChangelogEntries
