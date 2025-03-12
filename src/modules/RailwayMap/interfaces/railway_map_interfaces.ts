import BasePBCollection from '../../../core/interfaces/pb_interfaces'

interface IRailwayMapLine extends BasePBCollection {
  country: string
  type: string
  name: string
  color: string
  code: string
  ways: [number, number][]
  map_paths: [number, number][][]
}

interface IRailwayMapStation extends BasePBCollection {
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

export type { IRailwayMapLine, IRailwayMapStation }
