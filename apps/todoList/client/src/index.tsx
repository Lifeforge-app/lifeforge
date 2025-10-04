import { TodoListProvider } from '@/providers/TodoListProvider'
import { ModuleHeader } from 'lifeforge-ui'

import TodoListContainer from './components/TodoListContainer'

function TodoList() {
  return (
    <>
      <ModuleHeader />
      <TodoListProvider>
        <TodoListContainer />
      </TodoListProvider>
    </>
  )
}

export default TodoList
