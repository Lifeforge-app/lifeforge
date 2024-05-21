interface IFlashcardDeck {
  card_amount: number
  collectionId: string
  collectionName: string
  created: string
  id: string
  name: string
  tag: string
  updated: string
  expand: {
    tag: IFlashcardTag
  }
}

interface IFlashcardTag {
  amount: number
  collectionId: string
  collectionName: string
  color: string
  created: string
  id: string
  name: string
  updated: string
}

interface IFlashcardCard {
  id?: string
  answer: string
  question: string
}

export type { IFlashcardDeck, IFlashcardTag, IFlashcardCard }
