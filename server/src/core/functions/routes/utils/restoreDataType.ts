export default function restoreFormDataType(value: string): any {
  if (!value.startsWith('__type:'))
    return value === 'undefined' ? undefined : value

  const [meta, raw] = value.split(';', 2)

  const type = meta.replace('__type:', '')

  const parsed = JSON.parse(raw)

  switch (type) {
    case 'number':
    case 'boolean':
    case 'object':
    case 'array':
      return parsed
    case 'date':
      return new Date(parsed)
    default:
      return parsed
  }
}
