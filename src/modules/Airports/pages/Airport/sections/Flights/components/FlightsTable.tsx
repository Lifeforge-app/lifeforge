import clsx from 'clsx'
import React from 'react'
import useThemeColors from '@hooks/useThemeColor'

function FlightsTable({
  data
}: {
  data: Array<{
    time: string
    date: string
    origin: {
      iata: string
      name: string
    }
    flightNumber: string
    airline: string
    status: string
  }>
}): React.ReactElement {
  const { componentBg } = useThemeColors()
  return (
    <table className="mb-4 w-full border-separate border-spacing-0">
      <thead className="sticky top-[7.2rem]">
        <tr className="rounded-md">
          {['Time', 'Date', 'Origin', 'Flight Number', 'Airline', 'Status'].map(
            title => (
              <th
                key={title}
                className={clsx(
                  'border-b-2 border-bg-200 px-4 py-2 pt-4 text-bg-500 dark:border-bg-700',
                  componentBg
                )}
              >
                {title}
              </th>
            )
          )}
        </tr>
      </thead>
      <tbody>
        {data.map(flight => (
          <tr key={flight.flightNumber}>
            {[
              flight.time,
              flight.date,
              `${flight.origin.iata} - ${flight.origin.name}`,
              flight.flightNumber,
              flight.airline,
              flight.status
            ].map((value, index) => (
              <td
                key={index}
                className={clsx(
                  'border-b border-bg-200 px-4 py-2 text-center dark:border-bg-800',
                  index === 5 &&
                    (() => {
                      const statusColors: { [key: string]: string } = {
                        Landed: 'text-green-500',
                        Estimated: 'text-yellow-500',
                        Scheduled: 'text-blue-500',
                        Cancelled: 'text-red-500',
                        Departed: 'text-green-500'
                      }

                      for (const [key, color] of Object.entries(statusColors)) {
                        if (value.startsWith(key)) {
                          return color
                        }
                      }

                      return 'text-bg-500 dark:text-bg-400'
                    })(),
                  index !== 5 && 'text-bg-500 dark:text-bg-400'
                )}
              >
                {value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default FlightsTable
