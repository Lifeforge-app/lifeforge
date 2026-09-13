import { describe, expect, it } from 'vitest'

import { missionIdForPersonalTask, missionStatus, parseSquadMissions } from './data-source'

describe('Squad mission adapter', () => {
  it('derives a stable Squad mission id from a personal task id', () => {
    expect(missionIdForPersonalTask('abc123')).toBe('lifeforge-abc123')
    expect(missionIdForPersonalTask('abc123')).toBe(missionIdForPersonalTask('abc123'))
  })

  it('maps supported lifecycle states to board columns', () => {
    expect(missionStatus('queued')).toBe('todo')
    expect(missionStatus('in_flight')).toBe('doing')
    expect(missionStatus('done')).toBe('done')
  })

  it('parses the supported sq-tasks list format', () => {
    expect(parseSquadMissions('  sq-1,queued,ops,lifeforge,Ship board,-\n')).toEqual([
      { id: 'sq-1', state: 'queued', kind: 'ops', repo: 'lifeforge', title: 'Ship board', priority: '-' }
    ])
  })
})
