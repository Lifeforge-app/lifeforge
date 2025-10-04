import type { RecordModel } from 'pocketbase'

interface RailwayMapLine extends RecordModel {
  country: string
  type: string
  name: string
  color: string
  code: string
  ways: [number, number][]
  map_paths: [number, number][][]
}

interface RailwayMapStation extends RecordModel {
  name: string
  codes: string[]
  lines: string[]
  coords: [number, number]
  type: string
  map_data: {
    text: string
    x: number
    y: number
    width: number
    rotate: number
    textOffsetX: number
    textOffsetY: number
  }
}

type IRailwayMapViewType = 'earth' | 'list' | 'route'

export type { RailwayMapLine, RailwayMapStation, IRailwayMapViewType }
