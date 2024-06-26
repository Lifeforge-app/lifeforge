interface IAirportNOTAMEntry {
  id: string
  title: [string, string]
  status: string
  distance: string
  time: string
  codeSummary: string
  duration: string
}

export type { IAirportNOTAMEntry }
