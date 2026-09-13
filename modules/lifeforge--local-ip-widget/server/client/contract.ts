export const contract = {
  getLocalIp: {
    method: 'get',
    description: 'Get local IP address',
    noAuth: false,
    encrypted: true,
    isDownloadable: false,
    media: null,
    input: {},
    output: {
      OK: {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        type: 'object',
        properties: {
          addresses: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        },
        required: ['addresses'],
        additionalProperties: false
      }
    }
  }
} as const

export default contract
