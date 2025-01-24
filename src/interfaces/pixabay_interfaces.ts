interface IPixabaySearchFilter {
  imageType: 'all' | 'photo' | 'illustration' | 'vector'
  category:
    | 'backgrounds'
    | 'fashion'
    | 'nature'
    | 'science'
    | 'education'
    | 'feelings'
    | 'health'
    | 'people'
    | 'religion'
    | 'places'
    | 'animals'
    | 'industry'
    | 'computer'
    | 'food'
    | 'sports'
    | 'transportation'
    | 'travel'
    | 'buildings'
    | 'business'
    | 'music'
    | ''
  colors:
    | 'grayscale'
    | 'transparent'
    | 'red'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'turquoise'
    | 'blue'
    | 'lilac'
    | 'pink'
    | 'white'
    | 'gray'
    | 'black'
    | 'brown'
    | ''
  isEditorsChoice: boolean
}

type PixabaySearchFilterAction =
  | {
      type: 'SET_IMAGE_TYPE'
      payload: 'all' | 'photo' | 'illustration' | 'vector'
    }
  | { type: 'SET_CATEGORY'; payload: IPixabaySearchFilter['category'] }
  | { type: 'SET_COLORS'; payload: IPixabaySearchFilter['colors'] }
  | { type: 'SET_IS_EDITORS_CHOICE'; payload: boolean }

interface IPixabaySearchResult {
  total: number
  hits: Array<{
    id: string
    thumbnail: {
      url: string
      width: number
      height: number
    }
    imageURL: string
  }>
}

export type {
  IPixabaySearchFilter,
  PixabaySearchFilterAction,
  IPixabaySearchResult
}
