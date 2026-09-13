import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

export type LifecycleStatus = 'todo' | 'doing' | 'done'

export type BoardSource = 'personal' | 'mission'

export type BoardItem = {
  id: string
  title: string
  source: BoardSource
  status: LifecycleStatus
  priority?: string
  squadMissionId?: string
  repo?: string
  kind?: string
}

export type PersonalTask = {
  id: string
  summary: string
  status: LifecycleStatus
  priority?: string
  squadMissionId?: string
}

export type MissionCreation = { taskId: string }

export function missionIdForPersonalTask(taskId: string): string {
  return `lifeforge-${taskId}`
}

export type SquadMission = {
  id: string
  title: string
  state: string
  priority: string
  repo: string
  kind: string
}

export type UnifiedBoard = {
  lanes: { personal: BoardItem[]; work: BoardItem[] }
}

export function missionStatus(state: string): LifecycleStatus {
  if (state === 'done') return 'done'
  if (state === 'in_flight') return 'doing'

  return 'todo'
}

function csv(line: string): string[] {
  const values: string[] = []

  let value = ''
  let quoted = false

  for (const character of line) {
    if (character === '"') quoted = !quoted
    else if (character === ',' && !quoted) {
      values.push(value.trim())
      value = ''
    } else value += character
  }
  values.push(value.trim())

  return values.map(item => item.replace(/^"|"$/g, ''))
}

export function parseSquadMissions(output: string): SquadMission[] {
  return output
    .split(/\r?\n/)
    .filter(line => /^\s{2}\S/.test(line))
    .map(line => {
      const [
        id = '',
        state = '',
        kind = '',
        repo = '',
        title = '',
        priority = '-'
      ] = csv(line.trim())

      return { id, state, kind, repo, title, priority }
    })
    .filter(item => item.id && item.title)
}

export async function moveSquadMission(id: string, status: LifecycleStatus) {
  const command = process.env.SQ_TASKS || 'sq-tasks'
  const cwd = process.env.SQUAD_DIR || '/home/rehem/Projects/squad'
  const action =
    status === 'doing' ? 'start' : status === 'done' ? 'done' : 'reopen'
  await execFileAsync(command, [action, id, '--json'], {
    cwd,
    timeout: 10000,
    maxBuffer: 1024 * 1024
  })
}

export async function listSquadMissions(): Promise<SquadMission[]> {
  const command = process.env.SQ_TASKS || 'sq-tasks'
  const cwd = process.env.SQUAD_DIR || '/home/rehem/Projects/squad'
  const output = (
    await execFileAsync(
      command,
      [
        'list',
        '--fields',
        'blocked,blocked_by,held,hold_reason,hold_kind,links,priority'
      ],
      { cwd, timeout: 10000, maxBuffer: 1024 * 1024 }
    )
  ).stdout
  const missions = parseSquadMissions(output)

  return Promise.all(
    missions.map(async mission => {
      if (!mission.title.includes('(truncated,')) return mission

      try {
        const full = (
          await execFileAsync(command, ['show', mission.id, '--full'], {
            cwd,
            timeout: 10000,
            maxBuffer: 1024 * 1024
          })
        ).stdout
        const titleLine = full
          .split(/\r?\n/)
          .find(line => /^\s{2}title:\s/.test(line))
        const title = titleLine?.replace(/^\s{2}title:\s/, '')

        return title
          ? { ...mission, title: JSON.parse(title) as string }
          : mission
      } catch {
        return mission
      }
    })
  )
}

export async function getUnifiedBoard(
  listPersonalTasks: () => Promise<PersonalTask[]>
): Promise<UnifiedBoard> {
  const [personalTasks, missions] = await Promise.all([
    listPersonalTasks(),
    listSquadMissions()
  ])

  return {
    lanes: {
      personal: personalTasks.map(task => ({
        id: task.id,
        title: task.summary,
        source: 'personal',
        status: task.status,
        priority: task.priority,
        squadMissionId: task.squadMissionId
      })),
      work: missions.map(mission => ({
        id: mission.id,
        title: mission.title,
        source: 'mission',
        status: missionStatus(mission.state),
        priority: mission.priority,
        repo: mission.repo,
        kind: mission.kind
      }))
    }
  }
}
