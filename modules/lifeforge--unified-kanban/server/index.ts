import { createKanbanRouter } from './nest/bootstrap'

export {
  getUnifiedBoard,
  listSquadMissions,
  missionIdForPersonalTask,
  moveSquadMission
} from './data-source'

export type {
  BoardItem,
  BoardSource,
  LifecycleStatus,
  MissionCreation,
  PersonalTask,
  SquadMission,
  UnifiedBoard
} from './data-source'

export default await createKanbanRouter()
