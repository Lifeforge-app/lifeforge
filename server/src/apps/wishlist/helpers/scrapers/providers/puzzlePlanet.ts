import { JSDOM } from 'jsdom'
import PocketBase from 'pocketbase'

const scrapePuzzlePlanet = async (
  _: PocketBase,
  url: string
): Promise<{
  name: string
  image: string
  price: number
} | null> => {
  try {
    const dom = (await JSDOM.fromURL(url)).window.document

    const structuredData = JSON.parse(
      dom
        .querySelector('script[type="application/ld+json"]')
        ?.textContent?.trim() || '{}'
    )

    return {
      name: structuredData.name,
      image: structuredData.image,
      price: +structuredData.offers.price
    }
  } catch (error) {
    console.error('Error scraping data', error)
    return null
  }
}

export default scrapePuzzlePlanet
