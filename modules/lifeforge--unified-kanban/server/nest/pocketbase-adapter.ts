import { Injectable, NotFoundException } from '@nestjs/common'
import type PocketBase from 'pocketbase'

import type { PersonalTask } from '../data-source'

@Injectable()
export class PocketBaseAdapter {
  async listPersonalTasks(pb: PocketBase): Promise<PersonalTask[]> {
    const records = await pb.collection('todo_list__entries').getFullList({ sort: '-created' })

    return records.map(record => ({
      id: record.id,
      summary: String(record.summary),
      status: record.status === 'doing' || record.status === 'done' ? record.status : 'todo',
      priority: record.priority ? String(record.priority) : undefined,
      squadMissionId: record.squad_mission_id ? String(record.squad_mission_id) : undefined
    }))
  }

  async getPersonalTask(pb: PocketBase, id: string): Promise<PersonalTask | null> {
    try {
      const record = await pb.collection('todo_list__entries').getOne(id)

      return {
        id: record.id,
        summary: String(record.summary),
        status: record.status === 'doing' || record.status === 'done' ? record.status : 'todo',
        priority: record.priority ? String(record.priority) : undefined,
        squadMissionId: record.squad_mission_id ? String(record.squad_mission_id) : undefined
      }
    } catch (error: unknown) {
      if (isNotFound(error)) return null
      throw error
    }
  }

  async unlinkPersonalTask(pb: PocketBase, id: string) {
    return pb.collection('todo_list__entries').update(id, { squad_mission_id: null })
  }

  async linkPersonalTask(pb: PocketBase, id: string, squadMissionId: string) {
    return pb.collection('todo_list__entries').update(id, { squad_mission_id: squadMissionId })
  }

  async deletePersonalTask(pb: PocketBase, id: string) {
    return pb.collection('todo_list__entries').delete(id)
  }

  async movePersonalTask(pb: PocketBase, id: string, status: PersonalTask['status']) {
    return pb.collection('todo_list__entries').update(id, {
      status,
      done: status === 'done',
      completed_at: status === 'done' ? new Date().toISOString() : null
    })
  }
}

function isNotFound(error: unknown): boolean {
  if (error instanceof NotFoundException) return true
  if (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    (error as { status: unknown }).status === 404
  )
    return true

  return false
}
