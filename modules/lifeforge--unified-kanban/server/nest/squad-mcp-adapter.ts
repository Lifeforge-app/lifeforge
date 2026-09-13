import { HttpException, Injectable } from '@nestjs/common'
import { spawn } from 'node:child_process'

import { homedir } from 'node:os'

import type { MissionCreation } from '../data-source'

export class SquadMcpException extends HttpException {
  constructor(message: string) {
    super(message, 502)
  }
}

type CreateMissionInput = { id: string; title: string }

type RpcResponse = {
  id?: number
  result?: {
    content?: Array<{ text?: string }>
  }
  error?: { message?: string }
}

const MCP_TIMEOUT = 30000
const defaultCommand = `${homedir()}/.local/share/personal-os/squad-mcp/run-squad-mcp`

function responseFor(
  child: ReturnType<typeof spawn>,
  requestId: number
): Promise<RpcResponse> {
  return new Promise((resolve, reject) => {
    let buffer = ''

    const timeout = setTimeout(() => {
      reject(new SquadMcpException('Squad MCP request timed out'))
      child.kill()
    }, MCP_TIMEOUT)

    const onData = (chunk: Buffer) => {
      buffer += chunk.toString()
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (!line.trim()) continue
        let message: RpcResponse

        try {
          message = JSON.parse(line) as RpcResponse
        } catch {
          continue
        }
        if (message.id !== requestId) continue
        clearTimeout(timeout)
        child.stdout!.off('data', onData)
        child.off('error', onError)
        child.off('close', onClose)
        resolve(message)

        return
      }
    }
    const onError = (error: Error) => {
      clearTimeout(timeout)
      reject(new SquadMcpException(error.message))
    }
    const onClose = () => {
      clearTimeout(timeout)
      reject(new SquadMcpException('Squad MCP closed before replying'))
    }

    child.stdout!.on('data', onData)
    child.once('error', onError)
    child.once('close', onClose)
  })
}

async function callSquadMcp(
  name: string,
  arguments_: Record<string, string>
): Promise<Record<string, unknown>> {
  const command = process.env.SQUAD_MCP_COMMAND || defaultCommand
  const child = spawn(command, [], { stdio: ['pipe', 'pipe', 'ignore'] })

  try {
    const responsePromise = responseFor(child, 2)
    child.stdin.write(
      `${JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'lifeforge-unified-kanban', version: '1.0.0' }
        }
      })}\n`
    )
    child.stdin.write(
      `${JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' })}\n`
    )
    child.stdin.write(
      `${JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: { name, arguments: arguments_ }
      })}\n`
    )

    const response = await responsePromise

    if (response.error) throw new SquadMcpException(response.error.message || 'Squad MCP request failed')

    const text = response.result?.content?.[0]?.text

    if (!text) throw new SquadMcpException('Squad MCP returned an empty response')

    let result: Record<string, unknown>

    try {
      result = JSON.parse(text) as Record<string, unknown>
    } catch {
      throw new SquadMcpException('Squad MCP returned invalid JSON')
    }

    if (result.ok !== true) throw new SquadMcpException(String(result.error || 'Squad MCP request failed'))

    return result
  } finally {
    child.kill()
  }
}

@Injectable()
export class SquadMcpAdapter {
  async createMission(input: CreateMissionInput): Promise<MissionCreation> {
    const result = await callSquadMcp('squad_task_create', input)
    const taskId = result.taskId

    if (taskId !== input.id && taskId !== 'created') {
      throw new SquadMcpException('Squad MCP returned an unexpected mission id')
    }

    return { taskId: input.id }
  }

  async cancelMission(id: string): Promise<void> {
    await callSquadMcp('squad_task_cancel', { id })
  }
}
