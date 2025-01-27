import type { Moment } from 'moment'

export const getDatesBetween = (start: Moment, end: Moment): Moment[] => {
  if (!start.isValid() || !end.isValid() || start.isAfter(end, 'day')) {
    return []
  }

  if (start.isSame(end, 'day')) return [start]

  return [start].concat(getDatesBetween(start.clone().add(1, 'day'), end))
}
