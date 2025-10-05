export interface Station {
  id: string
  x: number
  y: number
  name: string
  lines: string[]
  type: 'station' | 'interchange'
  width: number
  height: number
  rotate?: number
  codes?: string[]
  textOffsetX?: number
  textOffsetY?: number
}

export interface Line {
  color: string
  name: string
  code: string
  path: [number, number][]
}

export interface Settings {
  bgImage: string | File | null
  bgImageScale: number
  bgImagePreview: string | null
  showImage: boolean
  darkMode: boolean
  colorOfCurrentLine: string
}
