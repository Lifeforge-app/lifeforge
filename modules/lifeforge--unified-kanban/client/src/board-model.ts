export type Column = 'todo' | 'doing' | 'done'

export type Source = 'personal' | 'mission'

export type BoardItem = {
  id: string
  title: string
  source: Source
  status: Column
  priority?: string
  squadMissionId?: string
  repo?: string
  kind?: string
}

export type BoardLane = { personal: BoardItem[]; work: BoardItem[] }

export type BoardResponse = { lanes: BoardLane }

export function normalizeBoard(data: BoardResponse): BoardLane {
  return {
    personal: data.lanes.personal ?? [],
    work: data.lanes.work ?? []
  }
}
