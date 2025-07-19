export const searchLocations = async (q: string, key: string) => {
  const response = await fetch(
    `https://places.googleapis.com/v1/places:searchText`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-FieldMask':
          'places.displayName,places.location,places.formattedAddress',
        'X-Goog-Api-Key': key
      },
      body: JSON.stringify({
        textQuery: q
      })
    }
  ).then(res => res.json())

  const places: {
    displayName: {
      languageCode: string
      text: string
    }
    formattedAddress: string
    location: {
      latitude: number
      longitude: number
    }
  }[] = response.places ?? []

  return places.map(place => ({
    name: place.displayName.text,
    formattedAddress: place.formattedAddress,
    location: {
      latitude: place.location.latitude,
      longitude: place.location.longitude
    }
  }))
}
