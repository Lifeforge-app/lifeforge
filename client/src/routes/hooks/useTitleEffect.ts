import _ from 'lodash'
import { useEffect } from 'react'
import { useLocation } from 'shared'

import ROUTES from '..'

function useTitleEffect() {
  const location = useLocation()

  useEffect(() => {
    const target =
      ROUTES.flatMap(e => e.items).filter(item =>
        location.pathname.slice(1).startsWith(_.kebabCase(item.name))
      )[0]?.name ?? ''

    document.title = `Lifeforge. ${target !== '' ? '- ' + target : ''}`
  }, [location])
}

export default useTitleEffect
