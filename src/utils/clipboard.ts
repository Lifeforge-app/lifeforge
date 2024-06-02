export const Clipboard = (function (window, document, navigator) {
  let textArea: HTMLTextAreaElement

  function isOS(): RegExpMatchArray | null {
    return navigator.userAgent.match(/ipad|iphone/i)
  }

  function createTextArea(text: string): void {
    textArea = document.createElement('textArea') as HTMLTextAreaElement
    textArea.value = text
    document.body.appendChild(textArea)
  }

  function selectText(): void {
    let range, selection

    if (isOS()) {
      range = document.createRange()
      range.selectNodeContents(textArea)
      selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)
      textArea.setSelectionRange(0, 999999)
    } else {
      textArea.select()
    }
  }

  function copyToClipboard(): void {
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }

  function copy(text: string): void {
    createTextArea(text)
    selectText()
    copyToClipboard()
  }

  return {
    copy
  }
})(window, document, navigator)
