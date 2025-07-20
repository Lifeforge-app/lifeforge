import colors from 'tailwindcss/colors'

const METHOD_COLORS: Record<string, Record<string, string>> = {
  GET: colors.blue,
  POST: colors.green,
  PUT: colors.yellow,
  DELETE: colors.red,
  PATCH: colors.orange
}

export default METHOD_COLORS
