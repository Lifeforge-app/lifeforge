import { FilterType } from '@functions/database/PBService/typescript/pb_service'
import { forgeController, forgeRouter } from '@functions/routes'
import { SCHEMAS } from '@schema'
import moment from 'moment'
import { z } from 'zod/v4'

const FILTERS: Record<string, FilterType<'todo_list__entries'>> = {
  all: [
    {
      field: 'done',
      operator: '=',
      value: false
    }
  ],
  today: [
    {
      field: 'done',
      operator: '=',
      value: false
    },
    {
      field: 'due_date',
      operator: '>=',
      value: moment().startOf('day').utc().format('YYYY-MM-DD HH:mm:ss')
    },
    {
      field: 'due_date',
      operator: '<=',
      value: moment()
        .endOf('day')
        .utc()
        .add(1, 'second')
        .format('YYYY-MM-DD HH:mm:ss')
    }
  ],
  scheduled: [
    {
      field: 'done',
      operator: '=',
      value: false
    },
    {
      field: 'due_date',
      operator: '!=',
      value: ''
    },
    {
      field: 'due_date',
      operator: '>=',
      value: moment().utc().format('YYYY-MM-DD HH:mm:ss')
    }
  ],
  overdue: [
    {
      field: 'done',
      operator: '=',
      value: false
    },
    {
      field: 'due_date',
      operator: '!=',
      value: ''
    },
    {
      field: 'due_date',
      operator: '<',
      value: moment().utc().format('YYYY-MM-DD HH:mm:ss')
    }
  ],
  completed: [
    {
      field: 'done',
      operator: '=',
      value: true
    }
  ]
}

const getStatusCounter = forgeController.query
  .description('Get status counter for todo entries')
  .input({})
  .callback(async ({ pb }) => {
    const counters = {
      all: 0,
      today: 0,
      scheduled: 0,
      overdue: 0,
      completed: 0
    }

    for (const type of Object.keys(FILTERS) as (keyof typeof FILTERS)[]) {
      const { totalItems } = await pb.getList
        .collection('todo_list__entries')
        .page(1)
        .perPage(1)
        .filter(FILTERS[type])
        .execute()

      counters[type as keyof typeof counters] = totalItems
    }

    return counters
  })

const getById = forgeController.query
  .description('Get todo entry by ID')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'todo_list__entries'
  })
  .callback(({ pb, query: { id } }) =>
    pb.getOne.collection('todo_list__entries').id(id).execute()
  )

const list = forgeController.query
  .description('Get all todo entries with optional filters')
  .input({
    query: z.object({
      list: z.string().optional(),
      status: z.string().optional().default('all'),
      priority: z.string().optional(),
      tag: z.string().optional(),
      query: z.string().optional()
    })
  })
  .existenceCheck('query', {
    tag: '[todo_list__tags]',
    list: '[todo_list__lists]',
    priority: '[todo_list__priorities]'
  })
  .callback(async ({ pb, query: { status, tag, list, priority } }) => {
    const finalFilter = [
      ...(FILTERS[status as keyof typeof FILTERS] || FILTERS.all),
      ...(tag ? ([{ field: 'tags', operator: '~', value: tag }] as const) : []),
      ...(list
        ? ([{ field: 'list', operator: '=', value: list }] as const)
        : []),
      ...(priority
        ? ([{ field: 'priority', operator: '=', value: priority }] as const)
        : [])
    ]

    return await pb.getFullList
      .collection('todo_list__entries')
      .filter(finalFilter)
      .sort(['-created'])
      .execute()
  })

const create = forgeController.mutation
  .description('Create a new todo entry')
  .input({
    body: SCHEMAS.todo_list.entries.omit({
      completed_at: true,
      done: true
    })
  })
  .existenceCheck('body', {
    list: '[todo_list__lists]',
    priority: '[todo_list__priorities]',
    tags: '[todo_list__tags]'
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.create
      .collection('todo_list__entries')
      .data({
        ...body,
        due_date:
          (body.due_date && !body.due_date_has_time
            ? moment(body.due_date).endOf('day').toISOString()
            : body.due_date) || ''
      })
      .execute()
  )

const update = forgeController.mutation
  .description('Update an existing todo entry')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.todo_list.entries.omit({
      completed_at: true,
      done: true
    })
  })
  .existenceCheck('query', {
    id: 'todo_list__entries'
  })
  .existenceCheck('body', {
    list: '[todo_list__lists]',
    priority: '[todo_list__priorities]',
    tags: '[todo_list__tags]'
  })
  .callback(({ pb, query: { id }, body }) =>
    pb.update
      .collection('todo_list__entries')
      .id(id)
      .data({
        ...body,
        due_date:
          (body.due_date && !body.due_date_has_time
            ? moment(body.due_date).endOf('day').toISOString()
            : body.due_date) || ''
      })
      .execute()
  )

const remove = forgeController.mutation
  .description('Delete a todo entry')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'todo_list__entries'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('todo_list__entries').id(id).execute()
  )

const toggleEntry = forgeController.mutation
  .description('Toggle completion status of a todo entry')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'todo_list__entries'
  })
  .callback(async ({ pb, query: { id } }) => {
    const entry = await pb.getOne
      .collection('todo_list__entries')
      .id(id)
      .execute()

    return await pb.update
      .collection('todo_list__entries')
      .id(id)
      .data({
        done: !entry.done,
        completed_at: entry.done
          ? null
          : moment().utc().format('YYYY-MM-DD HH:mm:ss')
      })
      .execute()
  })

export default forgeRouter({
  getById,
  list,
  getStatusCounter,
  create,
  update,
  remove,
  toggleEntry
})
