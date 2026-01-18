/**
 * Creates a helper function for generating media URLs.
 *
 * The returned function constructs a full URL to the media endpoint with
 * the appropriate query parameters for retrieving files from PocketBase.
 *
 * @param apiHost - The base URL of the API server
 * @returns A function that generates media URLs
 *
 * @example
 * ```typescript
 * const getMedia = createGetMediaHelper('https://api.example.com')
 * const imageUrl = getMedia({
 *   collectionId: 'users',
 *   recordId: 'abc123',
 *   fieldId: 'avatar',
 *   thumb: '200x200'
 * })
 * // => 'https://api.example.com/media?collectionId=users&recordId=abc123&fieldId=avatar&thumb=200x200'
 * ```
 */
export default function createGetMediaHelper(apiHost: string | undefined) {
  return (params: {
    /** The PocketBase collection ID */
    collectionId: string
    /** The record ID within the collection */
    recordId: string
    /** The field name containing the file */
    fieldId: string
    /** Optional thumbnail size (e.g., '200x200', '0x100') */
    thumb?: string
    /** Optional access token for protected files */
    token?: string
  }): string => {
    const searchParams = new URLSearchParams()

    searchParams.append('collectionId', params.collectionId)
    searchParams.append('recordId', params.recordId)
    searchParams.append('fieldId', params.fieldId)
    if (params.thumb) searchParams.append('thumb', params.thumb)
    if (params.token) searchParams.append('token', params.token)

    const mediaPath = `media?${searchParams.toString()}`

    if (apiHost?.startsWith('/')) {
      const origin = typeof window !== 'undefined' ? window.location.origin : ''

      return `${origin}${apiHost}/${mediaPath}`
    }

    return new URL(mediaPath, apiHost).toString()
  }
}
