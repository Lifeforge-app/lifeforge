import _ from 'lodash'
import { useLocation } from 'react-router'

import RightBarBottomLink from '../components/RightbarBottomLink'

function BottomLinkSection() {
  const location = useLocation()

  return (
    <>
      {[
        {
          label: 'Edit this page',
          to: `https://github.com/LifeForge-app/lifeforge/edit/main/apps/docs/src/contents/${
            location.pathname.split('/')?.[1]
          }/${_.upperFirst(
            _.camelCase(
              location.pathname.split('/')?.[2]?.replace(/-/g, ' ') || ''
            )
          )}.mdx`
        },
        {
          label: 'Issue Report',
          to: 'https://github.com/LifeForge-app/lifeforge/issues/new'
        },
        {
          label: 'Star on GitHub',
          to: 'https://github.com/LifeForge-app/lifeforge'
        }
      ].map(({ label, to }) => (
        <RightBarBottomLink key={label} to={to}>
          {label}
        </RightBarBottomLink>
      ))}
    </>
  )
}

export default BottomLinkSection
