import fs from 'fs'
import { JSDOM } from 'jsdom'

const data = await fetch('https://www.midvalleysouthkey.com/shop/directory/')

const html = await data.text()

const dom = new JSDOM(html)

const document = dom.window.document

const finalData = []

const links = Array.from(document.querySelectorAll("a[href^='/tenant']")).map(
  tenantEl =>
    `https://www.midvalleysouthkey.com${tenantEl.getAttribute('href')}`
)

for (const link of links) {
  const tenantData = await fetch(link)

  const tenantHtml = await tenantData.text()

  const tenantDom = new JSDOM(tenantHtml)

  const tenantDocument = tenantDom.window.document

  const name = tenantDocument.querySelector('h2')?.textContent?.trim()

  const unit = tenantDocument.querySelector('h6')?.textContent?.trim()

  const desc = tenantDocument.querySelector('p')?.textContent?.trim()

  const logo = tenantDocument.querySelector('img')?.getAttribute('src')?.trim()

  finalData.push({
    name,
    unit,
    desc,
    logo
  })

  console.log(`Scraped: ${name}`)
}

if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data')
}

fs.writeFileSync(
  './data/midValleyTenants.json',
  JSON.stringify(finalData, null, 2)
)
