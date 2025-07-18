export default async function forceDown(url: string, filename: string) {
  await fetch(url)
    .then(async function (t) {
      const content = await t.blob()

      const a = document.createElement('a')

      a.href = URL.createObjectURL(content)
      a.setAttribute('download', filename)

      a.click()
    })
    .catch(console.error)
}
