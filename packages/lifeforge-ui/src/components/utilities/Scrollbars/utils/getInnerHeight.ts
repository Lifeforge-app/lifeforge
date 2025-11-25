export default function getInnerHeight(el: HTMLElement): number {
  const { clientHeight } = el

  const { paddingTop, paddingBottom } = getComputedStyle(el)

  return clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom)
}
