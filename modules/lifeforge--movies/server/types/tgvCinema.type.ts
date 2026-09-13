export interface TGVCinema {
  success: boolean;
  error:   null;
  results: Results;
}

export interface Results {
  businessday:     Date;
  movieid:         string;
  experience:      null;
  experiencegroup: string;
  locations:       Location[];
}

export interface Location {
  state:     string;
  cinemaids: Cinemaid[];
}

export interface Cinemaid {
  cinemaid:    string;
  keyword:     string;
  name:        string;
  parkinginfo: null;
  mapurl:      null;
  address:     null;
}
