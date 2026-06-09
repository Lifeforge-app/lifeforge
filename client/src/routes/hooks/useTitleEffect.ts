import _ from 'lodash'
import { useEffect } from 'react'

import { useFederation } from '@lifeforge/federation'
import { useLocation } from 'react-router'

function useTitleEffect() {
  const { modules } = useFederation()

  const location = useLocation()

  useEffect(() => {
    const target =
      modules
        .flatMap(e => e.items)
        .filter(item =>
          location.pathname.slice(1).startsWith(_.kebabCase(item.name))
        )[0]?.name ?? ''

    document.title = `LifeForge. ${target !== '' ? '- ' + target : ''}`
  }, [location])
}

export default useTitleEffect
