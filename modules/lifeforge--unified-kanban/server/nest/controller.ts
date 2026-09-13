import { BadRequestException, Body, Controller, Delete, Get, Post, Query, Req } from '@nestjs/common'
import type { Request } from 'express'

import {
  getUnifiedBoard,
  missionIdForPersonalTask,
  moveSquadMission,
  type LifecycleStatus
} from '../data-source'
import { AuthAdapter } from './auth-adapter'
import { PocketBaseAdapter } from './pocketbase-adapter'
import { SquadMcpAdapter } from './squad-mcp-adapter'

const statuses = ['todo', 'doing', 'done'] as const

type MoveBody = { source: 'personal' | 'mission'; id: string; status: LifecycleStatus }
type PromoteBody = { taskId: string }
type UndoPromoteBody = { taskId: string }

@Controller('board')
export class BoardController {
  private readonly promoteLocks = new Map<string, Promise<unknown>>()

  constructor(
    private readonly auth: AuthAdapter,
    private readonly pocketbase: PocketBaseAdapter,
    private readonly squad: SquadMcpAdapter
  ) {}

  @Get()
  async get(@Req() request: Request) {
    const { pb } = await this.auth.authenticate(request)

    return { state: 'success', data: await getUnifiedBoard(() => this.pocketbase.listPersonalTasks(pb)) }
  }

  @Post('move')
  async move(@Req() request: Request, @Body() body: MoveBody) {
    const { pb } = await this.auth.authenticate(request)

    if (!body || !statuses.includes(body.status) || !body.id || (body.source !== 'personal' && body.source !== 'mission')) {
      throw new BadRequestException('Invalid board move')
    }
    if (body.source === 'personal') await this.pocketbase.movePersonalTask(pb, body.id, body.status)
    else await moveSquadMission(body.id, body.status)

    return { state: 'success', data: { id: body.id, source: body.source, status: body.status } }
  }

  @Post('promote')
  async promote(@Req() request: Request, @Body() body: PromoteBody) {
    const { pb } = await this.auth.authenticate(request)

    if (!body?.taskId) throw new BadRequestException('Invalid personal task')

    const task = await this.pocketbase.getPersonalTask(pb, body.taskId)

    if (!task) throw new BadRequestException('Personal task not found')

    if (task.squadMissionId) {
      return {
        state: 'success',
        data: { taskId: task.id, squadMissionId: task.squadMissionId, already: true }
      }
    }

    const previous = this.promoteLocks.get(task.id) ?? Promise.resolve()
    const locked = previous.then(
      () => this.promoteLocked(pb, task),
      () => this.promoteLocked(pb, task)
    )
    this.promoteLocks.set(task.id, locked)

    return locked.finally(() => {
      this.promoteLocks.delete(task.id)
    })
  }

  @Post('undo-promote')
  async undoPromote(@Req() request: Request, @Body() body: UndoPromoteBody) {
    const { pb } = await this.auth.authenticate(request)

    if (!body?.taskId) throw new BadRequestException('Invalid personal task')

    const task = await this.pocketbase.getPersonalTask(pb, body.taskId)

    if (!task) throw new BadRequestException('Personal task not found')

    if (!task.squadMissionId) {
      return { state: 'success', data: { taskId: task.id, squadMissionId: null, unlinked: false } }
    }

    const squadMissionId = task.squadMissionId
    await this.squad.cancelMission(squadMissionId)
    await this.pocketbase.unlinkPersonalTask(pb, task.id)

    return { state: 'success', data: { taskId: task.id, squadMissionId: null, unlinked: true } }
  }

  @Delete('task')
  async deleteTask(@Req() request: Request, @Query('taskId') taskId: string) {
    const { pb } = await this.auth.authenticate(request)

    if (!taskId) throw new BadRequestException('Invalid personal task')

    const task = await this.pocketbase.getPersonalTask(pb, taskId)

    if (!task) throw new BadRequestException('Personal task not found')

    if (task.squadMissionId) {
      await this.squad.cancelMission(task.squadMissionId)
    }

    await this.pocketbase.deletePersonalTask(pb, task.id)

    return { state: 'success', data: { taskId: task.id } }
  }

  private async promoteLocked(pb: unknown, task: { id: string; summary: string; squadMissionId?: string }): Promise<{ state: string; data: { taskId: string; squadMissionId: string; already: boolean } }> {
    const fresh = await this.pocketbase.getPersonalTask(pb as never, task.id)

    if (fresh?.squadMissionId) {
      return {
        state: 'success',
        data: { taskId: task.id, squadMissionId: fresh.squadMissionId, already: true }
      }
    }

    const squadMissionId = missionIdForPersonalTask(task.id)
    const mission = await this.squad.createMission({ id: squadMissionId, title: task.summary })

    if (mission.taskId !== squadMissionId) throw new BadRequestException('Invalid Squad mission')

    try {
      await this.pocketbase.linkPersonalTask(pb as never, task.id, squadMissionId)
    } catch (linkError) {
      try {
        await this.squad.cancelMission(squadMissionId)
      } catch {
        throw new BadRequestException(`Mission ${squadMissionId} created but not linked or cancelled — manual cleanup required`)
      }
      throw linkError
    }

    return {
      state: 'success',
      data: { taskId: task.id, squadMissionId, already: false }
    }
  }
}
