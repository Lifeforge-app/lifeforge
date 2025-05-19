import { IconCode } from '@tabler/icons-react'
import { lazy } from 'react'

export default {
  name: 'Code Time',
  icon: <IconCode />,
  routes: {
    'code-time': lazy(() => import('.'))
  },
  togglable: true
}
