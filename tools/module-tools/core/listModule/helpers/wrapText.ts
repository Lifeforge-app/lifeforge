function wrapText(text: string, maxLineLength = 30, maxLines = 3): string {
  if (text === '') return ''
  const words = text.split(' ')
  let currentLine = ''
  const lines = []

  words.forEach(word => {
    if ((currentLine + word).length > maxLineLength) {
      lines.push(currentLine.trim())
      currentLine = word + ' '
    } else {
      currentLine += word + ' '
    }
  })

  if (currentLine !== '') lines.push(currentLine.trim())

  if (lines.length > maxLines) {
    return lines.slice(0, maxLines).join('\n') + '\n...'
  }

  return lines.join('\n')
}

export default wrapText
