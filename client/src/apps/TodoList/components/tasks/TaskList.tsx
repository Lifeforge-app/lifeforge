import TaskItem from './TaskItem'

function TaskList({
  entries
}: {
  entries: ISchemaWithPB<TodoListCollectionsSchemas.IEntry>[]
}) {
  return (
    <div className="mt-4 flex flex-1 flex-col">
      <Scrollbar>
        <ul className="flex flex-1 flex-col gap-2 px-4 pb-8">
          {entries.map(entry => (
            <TaskItem key={entry.id} entry={entry} />
          ))}
        </ul>
      </Scrollbar>
    </div>
  )
}

export default TaskList
