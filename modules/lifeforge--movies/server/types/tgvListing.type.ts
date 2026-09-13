export interface TGVListing {
  success: boolean
  error: null
  results: Results
}

export interface Results {
  name: string
  itemkey: string
  movies: Movie[]
}

export interface Movie {
  assets: Asset[]
  recid: string
  itemkey: string
  name: string
  status: number
  pubdateutc: string
  extdata: MovieExtdata
}

export interface Asset {
  assetkey: string
  folderkey: string
  priority: number
  status: number
  description: string
  extdata: AssetExtdata
}

export interface AssetExtdata {
  fileinfo: Fileinfo | null
  ext: null
}

export interface Fileinfo {
  contenttype: string
  filepath: string
  fileurl: string
}

export interface MovieExtdata {
  exp: string[]
  tags: string[]
  promo: null
  folderkey: string
  movieinfo: Movieinfo
}

export interface Movieinfo {
  cast: string
  lang: string
  meta: Meta
  genre: string[]
  emblem: Emblem[]
  rating: string
  hocodes: string[]
  preview: Preview
  toptext: string
  director: string
  synopsis: string
  distributor: string
  runtimemins: number
  movieTrailer: string
  subtitlelang: string[]
  hocodedetails: Hocodedetail[]
  releasedatemy: string
  stateinactive: any[]
  staticContent: string
  previewDesktop: Preview
  trailerGallery: string[]
}

export interface Emblem {
  caption: string
  enddate: string
  startdate: string
  emblemcolor: string
  captioncolor: string
}

export interface Hocodedetail {
  title: string
  hocode: string
}

export interface Meta {
  name: string
  description: string
}

export interface Preview {
  type: string
  actionparam: string
}
