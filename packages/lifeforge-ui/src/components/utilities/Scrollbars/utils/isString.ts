export default function isString(maybe: unknown): maybe is string {
  return typeof maybe === 'string'
}
