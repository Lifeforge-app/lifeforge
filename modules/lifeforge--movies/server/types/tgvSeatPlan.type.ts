export interface TGVSeatPlan {
  success: boolean;
  error:   null;
  results: Results;
}

export interface Results {
  cinemaid:   string;
  sessionid:  string;
  seatlayout: Seatlayout;
}

export interface Seatlayout {
  areas:          Area[];
  areaCategories: AreaCategory[];
  boundaryRight:  number;
  boundaryLeft:   number;
  boundaryTop:    number;
  screenStart:    number;
  screenWidth:    number;
}

export interface AreaCategory {
  areaCategoryCode:        string;
  seatsToAllocate:         number;
  seatsAllocatedCount:     number;
  seatsNotAllocatedCount:  number;
  selectedSeats:           any[];
  isInSeatDeliveryEnabled: boolean;
}

export interface Area {
  number:                number;
  areaCategoryCode:      string;
  description:           string;
  descriptionAlt:        string;
  numberOfSeats:         number;
  isAllocatedSeating:    boolean;
  hasSofaSeatingEnabled: boolean;
  left:                  number;
  top:                   number;
  height:                number;
  width:                 number;
  rows:                  Row[];
  rowCount:              number;
  columnCount:           number;
}

export interface Row {
  rowIndexZeroBased: number;
  physicalName:      null | string;
  seats:             Seat[];
}

export interface Seat {
  position:       Position;
  priority:       number;
  id:             string;
  status:         number;
  seatStyle:      number;
  seatsInGroup:   Position[] | null;
  originalStatus: number;
}

export interface Position {
  areaNumber:  number;
  rowIndex:    number;
  columnIndex: number;
}
