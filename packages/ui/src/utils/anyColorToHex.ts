import { formatHex, parse } from 'culori'

export default function anyColorToHex(colorString: string) {
  return formatHex(parse(colorString))
}
