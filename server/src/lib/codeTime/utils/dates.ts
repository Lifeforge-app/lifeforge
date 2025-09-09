const addDays = (date: Date, days: number): Date => {
  const newDate = new Date(date.valueOf())

  newDate.setDate(newDate.getDate() + days)

  return newDate
}

export const getDates = (startDate: Date, stopDate: Date): Date[] => {
  const dateArray: Date[] = []

  let currentDate = startDate

  while (currentDate <= stopDate) {
    dateArray.push(new Date(currentDate))
    currentDate = addDays(currentDate, 1)
  }

  return dateArray
}
