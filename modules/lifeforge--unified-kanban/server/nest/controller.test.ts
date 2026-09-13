import { describe, expect, it, vi } from 'vitest'

import { BoardController } from './controller'

vi.mock('./auth-adapter', () => ({ AuthAdapter: class AuthAdapter {} }))

describe('BoardController', () => {
  it('authenticates and moves personal tasks through the PocketBase adapter', async () => {
    const authenticate = vi.fn().mockResolvedValue({ pb: {} })
    const movePersonalTask = vi.fn().mockResolvedValue(undefined)
    const controller = new BoardController(
      { authenticate } as never,
      { movePersonalTask } as never,
      {} as never
    )

    await expect(
      controller.move({} as never, {
        source: 'personal',
        id: 'task-1',
        status: 'doing'
      })
    ).resolves.toEqual({
      state: 'success',
      data: { id: 'task-1', source: 'personal', status: 'doing' }
    })
    expect(authenticate).toHaveBeenCalledOnce()
    expect(movePersonalTask).toHaveBeenCalledWith({}, 'task-1', 'doing')
  })

  it('rejects invalid lifecycle moves', async () => {
    const controller = new BoardController(
      { authenticate: vi.fn().mockResolvedValue({ pb: {} }) } as never,
      {} as never,
      {} as never
    )

    await expect(
      controller.move({} as never, {
        source: 'personal',
        id: '',
        status: 'todo'
      })
    ).rejects.toThrow('Invalid board move')
  })

  it('creates and persists one deterministic mission link', async () => {
    const authenticate = vi.fn().mockResolvedValue({ pb: {} })
    const task: {
      id: string
      summary: string
      status: 'todo'
      squadMissionId?: string
    } = {
      id: 'task-1',
      summary: 'Ship it',
      status: 'todo'
    }
    const getPersonalTask = vi.fn().mockResolvedValue(task)
    const linkPersonalTask = vi.fn().mockImplementation(async () => {
      task.squadMissionId = 'lifeforge-task-1'
    })
    const createMission = vi
      .fn()
      .mockResolvedValue({ taskId: 'lifeforge-task-1' })
    const controller = new BoardController(
      { authenticate } as never,
      { getPersonalTask, linkPersonalTask } as never,
      { createMission } as never
    )

    await expect(
      controller.promote({} as never, { taskId: 'task-1' })
    ).resolves.toEqual({
      state: 'success',
      data: {
        taskId: 'task-1',
        squadMissionId: 'lifeforge-task-1',
        already: false
      }
    })
    await expect(
      controller.promote({} as never, { taskId: 'task-1' })
    ).resolves.toEqual({
      state: 'success',
      data: {
        taskId: 'task-1',
        squadMissionId: 'lifeforge-task-1',
        already: true
      }
    })

    expect(createMission).toHaveBeenCalledOnce()
    expect(linkPersonalTask).toHaveBeenCalledOnce()
    expect(createMission).toHaveBeenCalledWith({
      id: 'lifeforge-task-1',
      title: 'Ship it'
    })
  })

  it('surfaces MCP failure without creating an orphaned link', async () => {
    const authenticate = vi.fn().mockResolvedValue({ pb: {} })
    const task: {
      id: string
      summary: string
      status: 'todo'
      squadMissionId?: string
    } = {
      id: 'task-1',
      summary: 'Ship it',
      status: 'todo'
    }
    const getPersonalTask = vi.fn().mockResolvedValue(task)
    const linkPersonalTask = vi.fn()
    const createMission = vi
      .fn()
      .mockRejectedValue(new Error('MCP server unavailable'))
    const controller = new BoardController(
      { authenticate } as never,
      { getPersonalTask, linkPersonalTask } as never,
      { createMission } as never
    )

    await expect(
      controller.promote({} as never, { taskId: 'task-1' })
    ).rejects.toThrow()

    expect(createMission).toHaveBeenCalledOnce()
    expect(linkPersonalTask).not.toHaveBeenCalled()
    expect(task.squadMissionId).toBeUndefined()
  })

  it('surfaces PocketBase failure during link and cancels the orphaned mission', async () => {
    const authenticate = vi.fn().mockResolvedValue({ pb: {} })
    const task: {
      id: string
      summary: string
      status: 'todo'
      squadMissionId?: string
    } = {
      id: 'task-1',
      summary: 'Ship it',
      status: 'todo'
    }
    const getPersonalTask = vi.fn().mockResolvedValue(task)
    const linkPersonalTask = vi
      .fn()
      .mockRejectedValue(new Error('PocketBase write failed'))
    const createMission = vi
      .fn()
      .mockResolvedValue({ taskId: 'lifeforge-task-1' })
    const cancelMission = vi.fn().mockResolvedValue(undefined)
    const controller = new BoardController(
      { authenticate } as never,
      { getPersonalTask, linkPersonalTask } as never,
      { createMission, cancelMission } as never
    )

    await expect(
      controller.promote({} as never, { taskId: 'task-1' })
    ).rejects.toThrow('PocketBase write failed')

    expect(createMission).toHaveBeenCalledOnce()
    expect(linkPersonalTask).toHaveBeenCalledOnce()
    expect(cancelMission).toHaveBeenCalledWith('lifeforge-task-1')
    expect(task.squadMissionId).toBeUndefined()
  })

  it('surfaces combined error when both link and compensation cancel fail', async () => {
    const authenticate = vi.fn().mockResolvedValue({ pb: {} })
    const task: {
      id: string
      summary: string
      status: 'todo'
      squadMissionId?: string
    } = {
      id: 'task-1',
      summary: 'Ship it',
      status: 'todo'
    }
    const getPersonalTask = vi.fn().mockResolvedValue(task)
    const linkPersonalTask = vi
      .fn()
      .mockRejectedValue(new Error('PocketBase write failed'))
    const createMission = vi
      .fn()
      .mockResolvedValue({ taskId: 'lifeforge-task-1' })
    const cancelMission = vi
      .fn()
      .mockRejectedValue(new Error('MCP unavailable'))
    const controller = new BoardController(
      { authenticate } as never,
      { getPersonalTask, linkPersonalTask } as never,
      { createMission, cancelMission } as never
    )

    await expect(
      controller.promote({} as never, { taskId: 'task-1' })
    ).rejects.toThrow(/lifeforge-task-1.*manual cleanup required/)

    expect(createMission).toHaveBeenCalledOnce()
    expect(cancelMission).toHaveBeenCalledWith('lifeforge-task-1')
    expect(task.squadMissionId).toBeUndefined()
  })

  it('returns already-true when a concurrent request linked the task while the lock was held', async () => {
    const authenticate = vi.fn().mockResolvedValue({ pb: {} })
    const taskFirst: {
      id: string
      summary: string
      status: 'todo'
      squadMissionId?: string
    } = {
      id: 'task-1',
      summary: 'Ship it',
      status: 'todo'
    }
    const taskSecond: {
      id: string
      summary: string
      status: 'todo'
      squadMissionId?: string
    } = {
      id: 'task-1',
      summary: 'Ship it',
      status: 'todo',
      squadMissionId: 'lifeforge-task-1'
    }

    let callCount = 0

    const getPersonalTask = vi.fn().mockImplementation(async () => {
      callCount++

      return callCount === 1 ? taskFirst : taskSecond
    })

    const linkPersonalTask = vi.fn()

    const createMission = vi.fn()

    const controller = new BoardController(
      { authenticate } as never,
      { getPersonalTask, linkPersonalTask } as never,
      { createMission } as never
    )

    await expect(
      controller.promote({} as never, { taskId: 'task-1' })
    ).resolves.toEqual({
      state: 'success',
      data: {
        taskId: 'task-1',
        squadMissionId: 'lifeforge-task-1',
        already: true
      }
    })

    expect(createMission).not.toHaveBeenCalled()
    expect(linkPersonalTask).not.toHaveBeenCalled()
  })

  it('cleans up the promote lock after a successful promotion', async () => {
    const authenticate = vi.fn().mockResolvedValue({ pb: {} })
    const task: {
      id: string
      summary: string
      status: 'todo'
      squadMissionId?: string
    } = {
      id: 'task-1',
      summary: 'Ship it',
      status: 'todo'
    }
    const getPersonalTask = vi.fn().mockResolvedValue(task)
    const linkPersonalTask = vi.fn().mockImplementation(async () => {
      task.squadMissionId = 'lifeforge-task-1'
    })
    const createMission = vi
      .fn()
      .mockResolvedValue({ taskId: 'lifeforge-task-1' })
    const controller = new BoardController(
      { authenticate } as never,
      { getPersonalTask, linkPersonalTask } as never,
      { createMission } as never
    )

    await controller.promote({} as never, { taskId: 'task-1' })

    expect((controller as any).promoteLocks.has('task-1')).toBe(false)
  })

  it('cleans up the promote lock after a failed promotion', async () => {
    const authenticate = vi.fn().mockResolvedValue({ pb: {} })
    const task: {
      id: string
      summary: string
      status: 'todo'
      squadMissionId?: string
    } = {
      id: 'task-1',
      summary: 'Ship it',
      status: 'todo'
    }
    const getPersonalTask = vi.fn().mockResolvedValue(task)
    const linkPersonalTask = vi.fn()
    const createMission = vi.fn().mockRejectedValue(new Error('MCP failure'))
    const controller = new BoardController(
      { authenticate } as never,
      { getPersonalTask, linkPersonalTask } as never,
      { createMission } as never
    )

    await expect(
      controller.promote({} as never, { taskId: 'task-1' })
    ).rejects.toThrow()

    expect((controller as any).promoteLocks.has('task-1')).toBe(false)
  })

  it('undoPromote clears the link and cancels the Squad mission', async () => {
    const authenticate = vi.fn().mockResolvedValue({ pb: {} })
    const task: {
      id: string
      summary: string
      status: 'todo'
      squadMissionId?: string
    } = {
      id: 'task-1',
      summary: 'Ship it',
      status: 'todo',
      squadMissionId: 'lifeforge-task-1'
    }
    const getPersonalTask = vi.fn().mockResolvedValue(task)
    const unlinkPersonalTask = vi.fn().mockResolvedValue(undefined)
    const cancelMission = vi.fn().mockResolvedValue(undefined)
    const controller = new BoardController(
      { authenticate } as never,
      { getPersonalTask, unlinkPersonalTask } as never,
      { cancelMission } as never
    )

    await expect(
      controller.undoPromote({} as never, { taskId: 'task-1' })
    ).resolves.toEqual({
      state: 'success',
      data: { taskId: 'task-1', squadMissionId: null, unlinked: true }
    })

    expect(unlinkPersonalTask).toHaveBeenCalledWith({}, 'task-1')
    expect(cancelMission).toHaveBeenCalledWith('lifeforge-task-1')
  })

  it('undoPromote is a no-op when the task has no linked mission', async () => {
    const authenticate = vi.fn().mockResolvedValue({ pb: {} })
    const getPersonalTask = vi.fn().mockResolvedValue({
      id: 'task-1',
      summary: 'Ship it',
      status: 'todo'
    })
    const unlinkPersonalTask = vi.fn()
    const cancelMission = vi.fn()
    const controller = new BoardController(
      { authenticate } as never,
      { getPersonalTask, unlinkPersonalTask } as never,
      { cancelMission } as never
    )

    await expect(
      controller.undoPromote({} as never, { taskId: 'task-1' })
    ).resolves.toEqual({
      state: 'success',
      data: { taskId: 'task-1', squadMissionId: null, unlinked: false }
    })

    expect(unlinkPersonalTask).not.toHaveBeenCalled()
    expect(cancelMission).not.toHaveBeenCalled()
  })

  it('undoPromote throws when the personal task is not found', async () => {
    const authenticate = vi.fn().mockResolvedValue({ pb: {} })
    const getPersonalTask = vi.fn().mockResolvedValue(null)
    const controller = new BoardController(
      { authenticate } as never,
      { getPersonalTask } as never,
      {} as never
    )

    await expect(
      controller.undoPromote({} as never, { taskId: 'missing' })
    ).rejects.toThrow('Personal task not found')
  })

  it('undoPromote cancels the mission before unlinking', async () => {
    const authenticate = vi.fn().mockResolvedValue({ pb: {} })
    const getPersonalTask = vi.fn().mockResolvedValue({
      id: 'task-1',
      summary: 'Ship it',
      status: 'todo',
      squadMissionId: 'lifeforge-task-1'
    })
    const unlinkPersonalTask = vi.fn().mockResolvedValue(undefined)
    const cancelMission = vi.fn().mockResolvedValue(undefined)
    const controller = new BoardController(
      { authenticate } as never,
      { getPersonalTask, unlinkPersonalTask } as never,
      { cancelMission } as never
    )

    await controller.undoPromote({} as never, { taskId: 'task-1' })

    const cancelCall = cancelMission.mock.invocationCallOrder[0]
    const unlinkCall = unlinkPersonalTask.mock.invocationCallOrder[0]
    expect(cancelCall).toBeLessThan(unlinkCall)
    expect(cancelMission).toHaveBeenCalledWith('lifeforge-task-1')
    expect(unlinkPersonalTask).toHaveBeenCalledWith({}, 'task-1')
  })

  it('undoPromote fails when MCP cancel fails and retains the local link', async () => {
    const authenticate = vi.fn().mockResolvedValue({ pb: {} })
    const getPersonalTask = vi.fn().mockResolvedValue({
      id: 'task-1',
      summary: 'Ship it',
      status: 'todo',
      squadMissionId: 'lifeforge-task-1'
    })
    const unlinkPersonalTask = vi.fn()
    const cancelMission = vi
      .fn()
      .mockRejectedValue(new Error('Squad MCP request failed'))
    const controller = new BoardController(
      { authenticate } as never,
      { getPersonalTask, unlinkPersonalTask } as never,
      { cancelMission } as never
    )

    await expect(
      controller.undoPromote({} as never, { taskId: 'task-1' })
    ).rejects.toThrow('Squad MCP request failed')
    expect(unlinkPersonalTask).not.toHaveBeenCalled()
  })

  it('deleteTask removes the personal task and cancels a linked Squad mission', async () => {
    const authenticate = vi.fn().mockResolvedValue({ pb: {} })
    const getPersonalTask = vi.fn().mockResolvedValue({
      id: 'task-1',
      summary: 'Ship it',
      status: 'todo',
      squadMissionId: 'lifeforge-task-1'
    })
    const deletePersonalTask = vi.fn().mockResolvedValue(undefined)
    const cancelMission = vi.fn().mockResolvedValue(undefined)
    const controller = new BoardController(
      { authenticate } as never,
      { getPersonalTask, deletePersonalTask } as never,
      { cancelMission } as never
    )

    await expect(controller.deleteTask({} as never, 'task-1')).resolves.toEqual(
      {
        state: 'success',
        data: { taskId: 'task-1' }
      }
    )

    expect(cancelMission).toHaveBeenCalledWith('lifeforge-task-1')
    expect(deletePersonalTask).toHaveBeenCalledWith({}, 'task-1')
  })

  it('deleteTask removes the personal task without calling MCP when no mission is linked', async () => {
    const authenticate = vi.fn().mockResolvedValue({ pb: {} })
    const getPersonalTask = vi.fn().mockResolvedValue({
      id: 'task-1',
      summary: 'Ship it',
      status: 'todo'
    })
    const deletePersonalTask = vi.fn().mockResolvedValue(undefined)
    const cancelMission = vi.fn()
    const controller = new BoardController(
      { authenticate } as never,
      { getPersonalTask, deletePersonalTask } as never,
      { cancelMission } as never
    )

    await expect(controller.deleteTask({} as never, 'task-1')).resolves.toEqual(
      {
        state: 'success',
        data: { taskId: 'task-1' }
      }
    )

    expect(cancelMission).not.toHaveBeenCalled()
    expect(deletePersonalTask).toHaveBeenCalledWith({}, 'task-1')
  })

  it('deleteTask throws when the personal task is not found', async () => {
    const authenticate = vi.fn().mockResolvedValue({ pb: {} })
    const getPersonalTask = vi.fn().mockResolvedValue(null)
    const controller = new BoardController(
      { authenticate } as never,
      { getPersonalTask } as never,
      {} as never
    )

    await expect(controller.deleteTask({} as never, 'missing')).rejects.toThrow(
      'Personal task not found'
    )
  })

  it('deleteTask fails when MCP cancel fails and retains the personal task', async () => {
    const authenticate = vi.fn().mockResolvedValue({ pb: {} })
    const getPersonalTask = vi.fn().mockResolvedValue({
      id: 'task-1',
      summary: 'Ship it',
      status: 'todo',
      squadMissionId: 'lifeforge-task-1'
    })
    const deletePersonalTask = vi.fn()
    const cancelMission = vi
      .fn()
      .mockRejectedValue(new Error('Squad MCP request failed'))
    const controller = new BoardController(
      { authenticate } as never,
      { getPersonalTask, deletePersonalTask } as never,
      { cancelMission } as never
    )

    await expect(controller.deleteTask({} as never, 'task-1')).rejects.toThrow(
      'Squad MCP request failed'
    )
    expect(deletePersonalTask).not.toHaveBeenCalled()
  })

  it('deleteTask cancels the mission before deleting the personal task', async () => {
    const authenticate = vi.fn().mockResolvedValue({ pb: {} })
    const getPersonalTask = vi.fn().mockResolvedValue({
      id: 'task-1',
      summary: 'Ship it',
      status: 'todo',
      squadMissionId: 'lifeforge-task-1'
    })
    const deletePersonalTask = vi.fn().mockResolvedValue(undefined)
    const cancelMission = vi.fn().mockResolvedValue(undefined)
    const controller = new BoardController(
      { authenticate } as never,
      { getPersonalTask, deletePersonalTask } as never,
      { cancelMission } as never
    )

    await controller.deleteTask({} as never, 'task-1')

    const cancelCall = cancelMission.mock.invocationCallOrder[0]
    const deleteCall = deletePersonalTask.mock.invocationCallOrder[0]
    expect(cancelCall).toBeLessThan(deleteCall)
  })
})
