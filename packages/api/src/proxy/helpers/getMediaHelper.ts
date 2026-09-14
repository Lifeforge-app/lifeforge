/**
 * Creates a helper function for generating media/file URLs.
 *
 * The returned function constructs a full URL to the files endpoint with
 * the appropriate query parameters for retrieving files from the storage provider.
 *
 * @param apiHost - The base URL of the API server
 * @returns A function that generates file URLs
 *
 * @example
 * ```typescript
 * const getMedia = createGetMediaHelper('https://api.example.com')
 * const imageUrl = getMedia({
 *   key: 'lifeforge--books-library/booksEntries/file-123.epub',
 *   thumb: '200x0'
 * })
 * // => 'https://api.example.com/files?key=lifeforge--books-library/booksEntries/file-123.epub&thumb=200x0'
 * ```
 */
export function createGetMediaHelper(apiHost: string | undefined) {
  return (params: {
    /** Storage key */
    key: string
    /** Optional thumbnail size (e.g., '200x0', '200x200') */
    thumb?: string
    /** Optional access token */
    token?: string
  }): string => {
    const searchParams = new URLSearchParams()

    searchParams.append('key', params.key)
    if (params.thumb) searchParams.append('thumb', params.thumb)
    if (params.token) searchParams.append('token', params.token)

    const fullPath = `files?${searchParams.toString()}`

    if (apiHost?.startsWith('/')) {
      const origin = typeof window !== 'undefined' ? window.location.origin : ''

      return `${origin}${apiHost}/${fullPath}`
    }

    return new URL(fullPath, apiHost).toString()
  }
}
