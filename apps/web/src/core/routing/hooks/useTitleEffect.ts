import _ from 'lodash'
import { useEffect } from 'react'
import { useLocation } from 'react-router'

import { useFederation } from '@lifeforge/federation'

function useTitleEffect() {
  const { moduleGroups } = useFederation()
  const location = useLocation()

  useEffect(() => {
    const target =
      moduleGroups
        .flatMap(e => e.items)
        .filter(item =>
          location.pathname.slice(1).startsWith(_.kebabCase(item.name))
        )[0]?.name ?? ''

    document.title = `LifeForge. ${target !== '' ? '- ' + target : ''}`
  }, [location, moduleGroups])
}

export default useTitleEffect
