import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  Box,
  Button,
  Card,
  Flex,
  ModuleHeader,
  TagChip,
  Text
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

const stateOptions = [
  ['in_flight', 'In Flight'],
  ['queued', 'Queued'],
  ['held', 'Held'],
  ['done', 'Done']
] as const
const columns = [...stateOptions, ['blocked', 'Blocked']] as const
const holdKinds = ['commander', 'external', 'load', 'parked', 'future'] as const
type State = (typeof stateOptions)[number][0]
type HoldKind = (typeof holdKinds)[number]
type Task = {
  id: string
  state: State
  kind: string
  repo: string
  title: string
  priority: string
  blocked_by: string
  blocked: string
  held: string
  hold_reason: string
  hold_kind: string
  links: string
}
type Filters = {
  state: State | ''
  repo: string
  blocked: boolean
  holdKind: string
  kind: string
}

function isHoldKind(value: string): value is HoldKind {
  return holdKinds.some(kind => kind === value)
}

export default function SquadBacklog() {
  const [tasks, setTasks] = useState<Task[]>([]),
    [filters, setFilters] = useState<Filters>({
      state: '',
      repo: '',
      blocked: false,
      holdKind: '',
      kind: ''
    })
  const [error, setError] = useState(''),
    [mode, setMode] = useState('connecting'),
    [refreshing, setRefreshing] = useState(false)
  const [form, setForm] = useState<{
    type: 'block' | 'hold'
    task: Task
  } | null>(null)
  const refresh = useCallback(async () => {
    setRefreshing(true)
    try {
      setTasks(
        (await forgeAPI.backlog.list
          .input({
            state: filters.state || undefined,
            repo: filters.repo || undefined,
            blocked: filters.blocked || undefined,
            holdKind: filters.holdKind || undefined,
            kind: filters.kind || undefined
          })
          .query()) as Task[]
      )
      setError('')
    } catch {
      setError('Unable to load Squad backlog')
    } finally {
      setRefreshing(false)
    }
  }, [filters])
  useEffect(() => {
    void refresh()
  }, [refresh])
  useEffect(() => {
    const events = new EventSource(
      `${import.meta.env.VITE_API_HOST || window.location.origin}/modules/17b66c3125cedf57d23cfea7bcce7a82ba5a3f0cbc58b937d9a4bcd7839f4d68/events`,
      { withCredentials: true }
    )
    events.onmessage = event => {
      const data = JSON.parse(event.data) as { type: string; mode?: string }
      if (data.type === 'mode')
        setMode(
          data.mode === 'watch'
            ? 'watching file'
            : 'polling (watcher unavailable)'
        )
      else void refresh()
    }
    events.onerror = () => {
      setMode('polling (SSE unavailable)')
    }
    return () => events.close()
  }, [refresh])
  useEffect(() => {
    if (!mode.startsWith('polling')) return
    const timer = window.setInterval(() => {
      if (!document.hidden) void refresh()
    }, 30000)
    return () => window.clearInterval(timer)
  }, [mode, refresh])
  const repos = useMemo(
    () => [...new Set(tasks.map(task => task.repo))].sort(),
    [tasks]
  )
  const move = async (task: Task, target: string) => {
    const current = task.state
    if (target === 'blocked') return setForm({ type: 'block', task })
    if (target === 'held') return setForm({ type: 'hold', task })
    const invalid =
      (current === 'done' && target === 'in_flight') ||
      (current === 'held' && target === 'done') ||
      (current === 'queued' && target === 'done')
    if (invalid) {
      setError(
        `Cannot move directly to ${target}; use the required multi-step path first.`
      )
      return
    }
    try {
      if (target === 'in_flight')
        await forgeAPI.mutation.start.input({ id: task.id }).mutate(undefined)
      else if (target === 'done') {
        if (!window.confirm(`Mark ${task.id} complete?`)) return
        await forgeAPI.mutation.done.input({ id: task.id }).mutate({})
      } else if (target === 'queued')
        await forgeAPI.mutation.reopen.input({ id: task.id }).mutate(undefined)
      await refresh()
    } catch {
      setError('Move failed; the card was reverted to the real backlog state')
      await refresh()
    }
  }
  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form) return
    const data = new FormData(event.currentTarget)
    try {
      if (form.type === 'block')
        await forgeAPI.mutation.block
          .input({ id: form.task.id, by: String(data.get('by')) })
          .mutate(undefined)
      else {
        const kind = String(data.get('kind'))
        if (!isHoldKind(kind)) {
          setError('Invalid hold kind')
          return
        }
        await forgeAPI.mutation.hold
          .input({ id: form.task.id, reason: String(data.get('reason')), kind })
          .mutate(undefined)
      }
      setForm(null)
      await refresh()
    } catch {
      setError(
        'Mutation failed; the card was reverted to the real backlog state'
      )
      await refresh()
    }
  }
  return (
    <Flex direction="column" height="100%">
      <ModuleHeader />
      <Box p="md" overflow="auto">
        <Flex align="center" gap="sm" justify="between" wrap="wrap">
          <Text as="h1" size="xl" weight="semibold">
            Squad Backlog
          </Text>
          <Flex align="center" gap="sm">
            <Text color="muted" size="sm">
              Refresh: {mode}
            </Text>
            <Button
              icon="tabler:refresh"
              loading={refreshing}
              onClick={() => void refresh()}
              variant="secondary"
            >
              Refresh
            </Button>
          </Flex>
        </Flex>
        <Flex align="end" gap="sm" mt="md" wrap="wrap">
          <label>
            State
            <select
              aria-label="State filter"
              value={filters.state}
              onChange={event =>
                setFilters({
                  ...filters,
                  state:
                    stateOptions.find(
                      ([value]) => value === event.target.value
                    )?.[0] ?? ''
                })
              }
            >
              <option value="">All states</option>
              {stateOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Repo
            <select
              aria-label="Repo filter"
              value={filters.repo}
              onChange={event =>
                setFilters({ ...filters, repo: event.target.value })
              }
            >
              <option value="">All repos</option>
              {repos.map(repo => (
                <option key={repo}>{repo}</option>
              ))}
            </select>
          </label>
          <label>
            <input
              aria-label="Blocked filter"
              type="checkbox"
              checked={filters.blocked}
              onChange={event =>
                setFilters({ ...filters, blocked: event.target.checked })
              }
            />{' '}
            Blocked
          </label>
          <label>
            Hold kind
            <select
              aria-label="Hold kind filter"
              value={filters.holdKind}
              onChange={event =>
                setFilters({ ...filters, holdKind: event.target.value })
              }
            >
              <option value="">All holds</option>
              {holdKinds.map(kind => (
                <option key={kind}>{kind}</option>
              ))}
            </select>
          </label>
          <details>
            <summary>Advanced filters</summary>
            <label>
              Kind
              <select
                aria-label="Kind filter"
                value={filters.kind}
                onChange={event =>
                  setFilters({ ...filters, kind: event.target.value })
                }
              >
                <option value="">All kinds</option>
                {['recon', 'strike', 'commander', 'ops', 'docs'].map(kind => (
                  <option key={kind}>{kind}</option>
                ))}
              </select>
            </label>
          </details>
        </Flex>
        {error && (
          <Text color="dangerous" mt="sm" role="alert">
            {error}
          </Text>
        )}
        <Flex gap="md" mt="md" overflow="auto">
          {columns.map(([state, title]) => (
            <Box key={state} style={{ minWidth: 260, width: 260 }}>
              <Text as="h2" mb="sm" weight="semibold">
                {title}
              </Text>
              <Flex direction="column" gap="sm">
                {tasks
                  .filter(task =>
                    state === 'blocked'
                      ? task.blocked === 'yes'
                      : state === 'held'
                        ? task.held === 'yes'
                        : task.state === state &&
                          task.blocked !== 'yes' &&
                          task.held !== 'yes'
                  )
                  .map(task => (
                    <Card
                      key={task.id}
                      draggable
                      isInteractive
                      onDragEnd={event => {
                        const target = (event.currentTarget as HTMLElement)
                          .dataset.dropTarget
                        if (target) void move(task, target)
                      }}
                      onDragStart={event =>
                        event.dataTransfer.setData('text/plain', task.id)
                      }
                    >
                      <Box p="sm" data-drop-target={state}>
                        <Text weight="semibold">{task.title}</Text>
                        <Text color="muted" size="xs">
                          {task.id}
                        </Text>
                        <Flex gap="xs" mt="xs" wrap="wrap">
                          <TagChip label={task.kind} />
                          <TagChip label={task.repo} variant="outlined" />
                          {task.priority !== '-' && (
                            <TagChip label={`P${task.priority}`} />
                          )}
                        </Flex>
                        <Flex gap="xs" mt="xs">
                          {task.state === 'queued' && (
                            <Button
                              icon="tabler:player-play"
                              onClick={event => {
                                event.stopPropagation()
                                void move(task, 'in_flight')
                              }}
                              variant="secondary"
                            >
                              Start
                            </Button>
                          )}
                          {task.state === 'in_flight' && (
                            <Button
                              icon="tabler:check"
                              onClick={event => {
                                event.stopPropagation()
                                void move(task, 'done')
                              }}
                            >
                              Complete
                            </Button>
                          )}
                          {task.state === 'done' && (
                            <Button
                              icon="tabler:rotate"
                              onClick={event => {
                                event.stopPropagation()
                                void move(task, 'queued')
                              }}
                              variant="secondary"
                            >
                              Reopen
                            </Button>
                          )}
                          {task.blocked === 'yes' &&
                            task.blocked_by !== 'none' && (
                              <Button
                                icon="tabler:lock-open"
                                onClick={event => {
                                  event.stopPropagation()
                                  void forgeAPI.mutation.unblock
                                    .input({ id: task.id, by: task.blocked_by })
                                    .mutate(undefined)
                                    .then(refresh)
                                    .catch(() => {
                                      setError(
                                        'Unblock failed; the card was reverted to the real backlog state'
                                      )
                                      void refresh()
                                    })
                                }}
                                variant="secondary"
                              >
                                Unblock
                              </Button>
                            )}
                          {task.held === 'yes' && (
                            <Button
                              icon="tabler:player-play"
                              onClick={event => {
                                event.stopPropagation()
                                void forgeAPI.mutation.unhold
                                  .input({ id: task.id })
                                  .mutate(undefined)
                                  .then(refresh)
                                  .catch(() => {
                                    setError(
                                      'Release failed; the card was reverted to the real backlog state'
                                    )
                                    void refresh()
                                  })
                              }}
                              variant="secondary"
                            >
                              Release
                            </Button>
                          )}
                          <Button
                            icon="tabler:lock"
                            onClick={event => {
                              event.stopPropagation()
                              setForm({ type: 'block', task })
                            }}
                            variant="plain"
                          >
                            Block
                          </Button>
                          <Button
                            icon="tabler:pause"
                            onClick={event => {
                              event.stopPropagation()
                              setForm({ type: 'hold', task })
                            }}
                            variant="plain"
                          >
                            Hold
                          </Button>
                        </Flex>
                        {task.blocked_by !== 'none' && (
                          <Text color="dangerous" size="xs">
                            Blocked by: {task.blocked_by}
                          </Text>
                        )}
                        {task.held === 'yes' && (
                          <Text color="orange-500" size="xs">
                            Held: {task.hold_reason} ({task.hold_kind})
                          </Text>
                        )}
                      </Box>
                    </Card>
                  ))}
              </Flex>
              <Box
                onDragOver={event => event.preventDefault()}
                onDrop={event => {
                  event.currentTarget.setAttribute('data-drop-target', state)
                  const id = event.dataTransfer.getData('text/plain')
                  const task = tasks.find(item => item.id === id)
                  if (task) void move(task, state)
                }}
                style={{ minHeight: 40 }}
              />
            </Box>
          ))}
        </Flex>
        {form && (
          <Box bg="bg-100" mt="md" p="md" r="md">
            <form onSubmit={submitForm}>
              <Text weight="semibold">
                {form.type === 'block' ? 'Choose blocker' : 'Hold task'}
              </Text>
              {form.type === 'block' ? (
                <input
                  name="by"
                  required
                  pattern="[a-z0-9][a-z0-9-]*"
                  placeholder="blocker task id"
                />
              ) : (
                <Flex direction="column" gap="sm">
                  <input
                    name="reason"
                    maxLength={200}
                    required
                    placeholder="reason"
                  />
                  <select name="kind" required defaultValue="commander">
                    {holdKinds.map(kind => (
                      <option key={kind}>{kind}</option>
                    ))}
                  </select>
                </Flex>
              )}
              <Flex gap="sm" mt="sm">
                <Button type="submit">Apply</Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setForm(null)}
                >
                  Cancel
                </Button>
              </Flex>
            </form>
          </Box>
        )}
      </Box>
    </Flex>
  )
}
