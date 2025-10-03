import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Todo List',
  icon: 'tabler:list-check',
  routes: {
    'todo-list': lazy(() => import('@apps/01.Productivity/todoList'))
  },
  togglable: true,
  hasAI: true,
  requiredAPIKeys: ['groq']
} satisfies ModuleConfig
