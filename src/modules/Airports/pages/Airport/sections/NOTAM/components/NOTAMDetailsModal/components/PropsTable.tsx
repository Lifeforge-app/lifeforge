import moment from 'moment'
import React from 'react'

function PropsTable({ data }: { data: any }): React.ReactElement {
  return (
    <table className="mt-6 w-full">
      <tbody>
        {data.qualification.location !== undefined && (
          <tr className="border-b border-bg-200 p-4 dark:border-bg-800">
            <td className="w-1/2 whitespace-nowrap px-2 py-4 font-semibold">
              FIR
            </td>
            <td className="w-1/2 px-2 py-4">
              {data.qualification.location[1]} ({data.qualification.location[0]}
              )
            </td>
          </tr>
        )}
        {data.limits !== undefined && (
          <tr className="border-b border-bg-200 dark:border-bg-800">
            <td className="px-2 py-4 font-semibold">Vertical Limits</td>
            <td className="px-2 py-4">
              {data.limits.lower} - {data.limits.upper}
            </td>
          </tr>
        )}
        {data.schedule.activityStart !== null && (
          <tr className="border-b border-bg-200 dark:border-bg-800">
            <td className="px-2 py-4 font-semibold">Activity Start</td>
            <td className="px-2 py-4">
              {moment(data.schedule.activityStart).format('LLL')}
            </td>
          </tr>
        )}
        {data.schedule.validityEnd !== null && (
          <tr className="border-b border-bg-200 dark:border-bg-800">
            <td className="px-2 py-4 font-semibold">Validity End</td>
            <td className="px-2 py-4">
              {moment(data.schedule.activityEnd).format('LLL')}
            </td>
          </tr>
        )}
        <tr className="border-b border-bg-200 dark:border-bg-800">
          <td className="px-2 py-4 font-semibold">Traffic</td>
          <td className="px-2 py-4">
            {data.qualification.traffic
              .map((e: { code: string; description: string }) => e.description)
              .join(', ') || '-'}
          </td>
        </tr>
        <tr className="border-b border-bg-200 dark:border-bg-800">
          <td className="px-2 py-4 font-semibold">Scope</td>
          <td className="px-2 py-4">
            {data.qualification.scope
              .map((e: { code: string; description: string }) => e.description)
              .join(', ') || '-'}
          </td>
        </tr>
        <tr className="border-b border-bg-200 dark:border-bg-800">
          <td className="px-2 py-4 font-semibold">Purpose</td>
          <td className="px-2 py-4">
            {data.qualification.purpose
              .map((e: { code: string; description: string }) => e.description)
              .join(', ') || '-'}
          </td>
        </tr>
        {data.qualification.coordinates !== undefined && (
          <tr className="border-b border-bg-200 dark:border-bg-800">
            <td className="px-2 py-4 font-semibold">Radius</td>
            <td className="px-2 py-4">
              {data.qualification.coordinates[1]?.radius} NM
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default PropsTable
