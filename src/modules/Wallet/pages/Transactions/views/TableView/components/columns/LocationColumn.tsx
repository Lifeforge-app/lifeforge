import React from 'react'

function LocationColumn({
  location
}: {
  location: string
}): React.ReactElement {
  return <td className="max-w-96 p-2">{location}</td>
}

export default LocationColumn
