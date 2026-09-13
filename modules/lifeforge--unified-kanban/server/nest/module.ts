import { Module } from '@nestjs/common'

import { BoardController } from './controller'
import { AuthAdapter } from './auth-adapter'
import { PocketBaseAdapter } from './pocketbase-adapter'
import { SquadMcpAdapter } from './squad-mcp-adapter'

@Module({ controllers: [BoardController], providers: [AuthAdapter, PocketBaseAdapter, SquadMcpAdapter] })
export class KanbanModule {}
