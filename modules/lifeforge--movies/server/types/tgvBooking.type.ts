export interface TGVBooking {
  success: boolean
  error: null
  results: Results
}

export interface Results {
  bookings: BookingElement[]
  hasmorerows: boolean
  startrowindex: number
}

export interface BookingElement {
  booking: BookingBooking
  concessiononly: boolean
  expireddate: string
  tickets: Ticket[]
  concessions: Concession[] | null
  cinemainfo: Cinemainfo
  sessioninfo: Sessioninfo
  movieassetsinfo: Movieassetsinfo[]
}

export interface BookingBooking {
  recid: string
  orderno: string
  vistabookingid: string
  createdateutc: string
  lastupdateutc: string
  ordertotalprice: number
  status: string
  ismvcpurchase: boolean
  userrecid: string
  flags: string
  itemtype: string
  itemkey: string
  itemtext: string
  summary: string
  extdata: BookingExtdata
}

export interface BookingExtdata {
  moviemoney: number
}

export interface Cinemainfo {
  cinemaid: string
  keyword: null
  name: string
  parkinginfo: string
  mapurl: string
  address: string
}

export interface Concession {
  id: null | string
  itemid: string
  description: string
  descriptionalt: null | string
  parentitemid: null | string
  finalpriceincents: number | null
  recipeitems: Concession[] | null
}

export interface Movieassetsinfo {
  assetkey: string
  folderkey: string
  priority: number
  status: number
  description: string
  extdata: MovieassetsinfoExtdata
}

export interface MovieassetsinfoExtdata {
  fileinfo: Fileinfo
  ext: null
}

export interface Fileinfo {
  contenttype: string
  filepath: string
  fileurl: string
}

export interface Sessioninfo {
  sessionid: string
  screenname: string
  sessiondatemy: string
  businessdate: string
  movieinfo: Movieinfo
  cinemaid: string
  experience: string
  altmobtel: string
  altemail: string
  scheduledfilmid: string
}

export interface Movieinfo {
  movieid: string
  name: string
  itemkey: string
  tags: string[]
  genre: string[]
}

export interface Ticket {
  seats: Seat[]
  childconcessions: Childconcession[]
  tickettypecode: string
  tickettypedescription: string
  tickettypedescriptionalt: null | string
  ticketfinalprice: number
  voucherbarcode: string
}

export interface Childconcession {
  itemid: string
  description: string
}

export interface Seat {
  name: string
  areacategorycode: string
  rowdisplay: string
  coldisplay: string
  quantity: number
}
