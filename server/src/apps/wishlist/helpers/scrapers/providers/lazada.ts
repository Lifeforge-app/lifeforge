import { fetchAI } from '@functions/fetchAI'
import ogs from 'open-graph-scraper'
import PocketBase from 'pocketbase'

const scrapeLazada = async (
  pb: PocketBase,
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
      image: string
      price: number
    } = {
      name: '',
      image: '',
      price: 0
    }

    const { result } = await ogs(options)

    const imageURL = result.ogImage?.[0]?.url

    final.image = imageURL || ''

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

export default scrapeLazada
