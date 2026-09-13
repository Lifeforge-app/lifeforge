export interface TGVMovieSession {
  success: boolean;
  error:   null;
  results: Results;
}

export interface Results {
  businessday: Businessday;
  movies:      ResultsMovie[];
}

export interface Businessday {
  businessday: string;
  cinemas:     CinemaElement[];
}

export interface CinemaElement {
  cinemaid:    string;
  name:        string;
  experiences: string;
  extdata:     CinemaExtdata;
  movies:      CinemaMovie[];
}

export interface CinemaExtdata {
  exp:       string[];
  cinema:    ExtdataCinema;
  folderkey: string;
}

export interface ExtdataCinema {
  id:              string;
  meta:            Meta;
  mapurl:          string;
  address:         string;
  keyword:         string;
  features:        any[];
  latitude:        string;
  location:        string;
  longitude:       string;
  telephone:       string;
  description:     string;
  parkinginfo:     string;
  openingHours:    any[];
  addressRegion:   string;
  nearbycinemas:   string[];
  addressLocality: string;
  addressPostcode: string;
}

export interface Meta {
  name:        string;
  description: string;
}

export interface CinemaMovie {
  movieid:     string;
  experiences: Experience[];
}

export interface Experience {
  experience: string;
  sessions:   Session[];
}

export interface Session {
  sessionid:       string;
  cinemaid:        string;
  scheduledfilmid: string;
  showtimemy:      string;
  screenname:      string;
  businessdate:    string;
  experience:      string;
  seattypes:       string;
  status:          number;
  movieid:         string;
  extdata:         SessionExtdata;
  seatstatus:      null;
}

export interface SessionExtdata {
  seattype:              string[];
  areacategorycodes:     string[];
  conceptattributenames: string[];
  sessionattributenames: string[];
}

export interface ResultsMovie {
  assets:       Asset[];
  recid:        string;
  itemkey:      string;
  name:         string;
  folderkey:    null;
  shortcontent: null;
  fullcontent:  null;
  status:       number;
  pubdateutc:   string;
  extdata:      MovieExtdata;
}

export interface Asset {
  assetkey:    string;
  folderkey:   string;
  priority:    number;
  status:      number;
  description: string;
  extdata:     AssetExtdata;
}

export interface AssetExtdata {
  fileinfo: Fileinfo;
  ext:      null;
}

export interface Fileinfo {
  contenttype: string;
  filepath:    string;
  fileurl:     string;
}

export interface MovieExtdata {
  exp:       string[];
  tags:      string[];
  promo:     null;
  folderkey: string;
  movieinfo: Movieinfo;
}

export interface Movieinfo {
  cast:           string;
  lang:           string;
  meta:           Meta;
  genre:          string[];
  emblem:         any[];
  rating:         string;
  hocodes:        string[];
  preview:        Preview;
  toptext:        string;
  director:       string;
  synopsis:       string;
  distributor:    string;
  runtimemins:    number;
  movieTrailer:   string;
  subtitlelang:   string[];
  hocodedetails:  Hocodedetail[];
  releasedatemy:  string;
  stateinactive:  any[];
  staticContent:  string;
  previewDesktop: Preview;
  trailerGallery: string[];
}

export interface Hocodedetail {
  title:  string;
  hocode: string;
}

export interface Preview {
  type:        string;
  actionparam: string;
}
