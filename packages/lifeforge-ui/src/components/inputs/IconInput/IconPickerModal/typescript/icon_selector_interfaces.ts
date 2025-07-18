interface IIconSet {
  name: string
  total?: number
  author: Author
  license: License
  samples?: string[]
  palette?: boolean
  hidden?: boolean
  prefix: string
  height?: number | number[]
}

interface Author {
  name: string
  url?: string
}

interface License {
  title: string
  spdx?: string
  url?: string
}

export type { IIconSet }
