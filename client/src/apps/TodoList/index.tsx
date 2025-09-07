import { ModuleHeader } from 'lifeforge-ui'

import { TodoListProvider } from '@apps/TodoList/providers/TodoListProvider'

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
