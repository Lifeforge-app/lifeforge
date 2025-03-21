import type { RecordModel } from 'pocketbase'

interface IRailwayMapLine extends RecordModel {
  country: string
  type: string
  name: string
  color: string
  code: string
  ways: [number, number][]
  map_paths: [number, number][][]
}

interface IRailwayMapStation extends RecordModel {
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

export type { IRailwayMapLine, IRailwayMapStation, IRailwayMapViewType }
