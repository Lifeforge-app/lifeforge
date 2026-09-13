export interface TGVSeatStatus {
  success: boolean;
  error:   null;
  results: Results;
}

export interface Results {
  cinemaid:       string;
  seatstatuslist: Seatstatuslist[];
}

export interface Seatstatuslist {
  sessionid:      string;
  seatstotal:     number;
  seatsused:      number;
  usedpercentage: number;
}
