export default function forceDown(url: string, filename: string): void {
  fetch(url)
    .then(async function (t) {
      await t.blob().then(b => {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(b)
        a.setAttribute('download', filename)
        a.click()
      })
    })
    .catch(console.error)
}
