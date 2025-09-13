import { PBService } from '@functions/database'
import { fetchAI } from '@functions/external/ai'
import ogs from 'open-graph-scraper'
import sharp from 'sharp'
import { createWorker } from 'tesseract.js'

const getPrice = async (imageURL: string): Promise<number> => {
  try {
    const imageBuffer = await fetch(imageURL).then(res => res.arrayBuffer())

    const image = sharp(Buffer.from(imageBuffer))

    const { width, height } = await image.metadata()

    if (!width || !height) {
      throw new Error('Image metadata not found')
    }

    const crop = image.extract({
      left: Math.floor(width / 2),
      top: 0,
      width: Math.floor(width / 2),
      height: Math.floor(height / 2)
    })

    const buffer = await crop.toBuffer()

    const worker = await createWorker('digits', 3, {
      langPath: './src/core/models',
      cachePath: './src/core/models',
      cacheMethod: 'readOnly',
      gzip: false
    })

    const ret = await worker.recognize(buffer)

    await worker.terminate()

    const numbers = ret.data.text
      .split('\n')
      .filter(e => e)
      .pop()
      ?.split('-')
      .map(e => parseFloat(e?.replace(/,|(?: \.)/g, '') || '')) || [0]

    return Math.max(...numbers)
  } catch {
    console.error('Error getting price')

    return 0
  }
}

async function getImageURL(url: string): Promise<string> {
  const options = {
    url,
    fetchOptions: {
      headers: {
        'User-Agent': 'TelegramBot (like TwitterBot)'
      }
    }
  }

  const { result } = await ogs(options)

  return result.ogImage?.[0]?.url || ''
}

const scrapeShopee = async (
  pb: PBService,
  url: string
): Promise<{
  name: string
  image: string
  price: number
} | null> => {
  try {
    const options = {
      url,
      fetchOptions: {
        headers: {
          'User-Agent':
            'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
        }
      }
    }

    const final: {
      name: string
      price: number
      image: string
    } = {
      name: '',
      price: 0,
      image: ''
    }

    const { result } = await ogs(options)

    const imageURL = result.ogImage?.[0]?.url

    if (imageURL) {
      final.price = await getPrice(imageURL)
    }
    final.image = await getImageURL(url)

    const prompt = `Extract the most relevant and concise product name from the given product title, removing any unnecessary words or phrases such as descriptions, locations, and promotions. The extracted product name should be a clear and accurate representation of the product being sold. If there is the brand name of the product, the result should be in the format of "{brand} - {product name}". Please provide the extracted product name without any other words other than the product name itself.
  
  ${result.ogTitle}`

    final.name =
      (await fetchAI({
        pb,
        provider: 'groq',
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })) || ''

    return final
  } catch (error) {
    console.error('Error scraping data', error)

    return null
  }
}

export default scrapeShopee
