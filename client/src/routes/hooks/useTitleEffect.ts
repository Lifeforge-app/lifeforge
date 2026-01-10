import _ from 'lodash'
import { useEffect } from 'react'
import { useLocation } from 'shared'

import { useFederation } from '@/federation'

function useTitleEffect() {
  const { modules } = useFederation()

  const location = useLocation()

  useEffect(() => {
    const target =
      modules.flatMap(e => e.items).filter(item =>
        location.pathname.slice(1).startsWith(_.kebabCase(item.name))
      )[0]?.name ?? ''

    document.title = `LifeForge. ${target !== '' ? '- ' + target : ''}`
  }, [location])
}

export default useTitleEffect
