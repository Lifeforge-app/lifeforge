export interface TGVStates {
  success: boolean;
  results: Result[];
}

export interface Result {
  label:   string;
  value:   string;
  cinemas: Cinema[];
}

export interface Cinema {
  cinemaid: string;
  name:     string;
}
