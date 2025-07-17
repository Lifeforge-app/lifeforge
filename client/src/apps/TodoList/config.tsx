import { IconListCheck } from '@tabler/icons-react'
import { lazy } from 'react'

import { ModuleConfig } from '../../core/routes/interfaces/routes_interfaces'

export default {
  name: 'Todo List',
  icon: <IconListCheck />,
  routes: {
    'todo-list': lazy(() => import('@apps/TodoList'))
  },
  togglable: true,
  hasAI: true,
  requiredAPIKeys: ['groq']
} satisfies ModuleConfig
