export function mockController() {
  return {
    query: async () => 'mock-challenge',
    mutate: async () => true,
    queryOptions: () => ({
      queryKey: ['mock'],
      queryFn: async () => 'mock-challenge'
    }),
    mutationOptions: function <T>(opts?: T) {
      return {
        ...opts,
        mutationKey: ['mock'],
        mutationFn: async () => true
      }
    },
    setHost: () => {
      return this
    },
    input: () => {
      return this
    },
    get key() {
      return ['mock']
    },
    get endpoint() {
      return ''
    }
  }
}
