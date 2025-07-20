const METHOD_COLORS: Record<
  string,
  {
    color: string
    bg: string
    border: string
  }
> = {
  GET: {
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500'
  },
  POST: {
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500'
  },
  PUT: {
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500'
  },
  DELETE: {
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500'
  },
  PATCH: {
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500'
  }
}

export default METHOD_COLORS
