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
  }
}

export default METHOD_COLORS
