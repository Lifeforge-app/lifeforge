import { ClientError, createForge } from '@lifeforge/server-utils'
import z from 'zod'

const forge = createForge({}, 'cors_anywhere')

// SSRF Protection: Block internal/private IP addresses and metadata endpoints
const BLOCKED_HOSTS = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '[::1]',
  '169.254.169.254', // AWS metadata
  'metadata.google.internal', // GCP metadata
  'metadata', // Generic metadata
  '192.168.',
  '10.',
  '172.16.',
  '172.17.',
  '172.18.',
  '172.19.',
  '172.20.',
  '172.21.',
  '172.22.',
  '172.23.',
  '172.24.',
  '172.25.',
  '172.26.',
  '172.27.',
  '172.28.',
  '172.29.',
  '172.30.',
  '172.31.'
]

function isBlockedHost(url: string): boolean {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase()

    return BLOCKED_HOSTS.some(
      blocked =>
        hostname === blocked || hostname.startsWith(blocked) || hostname.endsWith(blocked)
    )
  } catch {
    return true
  }
}

const corsAnywhere = forge
  .query()
  .description('CORS Anywhere - Fetch external URL content')
  .input({
    query: z.object({
      url: z.url()
    })
  })
  .callback(async ({ query: { url }, core: { logging } }) => {
    // Security: Prevent SSRF attacks
    if (isBlockedHost(url)) {
      throw new ClientError('Access to this URL is forbidden', 403)
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      }
    }).catch((error) => {
      logging.error(`Failed to fetch URL: ${url}`, { error: error instanceof Error ? error.message : String(error) })
      return null
    })

    if (!response) {
      throw new ClientError('Failed to fetch URL', 502)
    }

    if (!response.ok) {
      throw new ClientError(`Failed to fetch URL: ${url}`, response.status)
    }

    if (response.headers.get('content-type')?.includes('application/json')) {
      const json = await response.json()

      return json
    }

    return response.text()
  })

export default corsAnywhere
