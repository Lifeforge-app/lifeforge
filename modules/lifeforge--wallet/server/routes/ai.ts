import dayjs from 'dayjs'
import z from 'zod'

import type { IPBService } from '@lifeforge/pocketbase'
import type { FetchAIFunc, SearchLocationsFunc } from '@lifeforge/server-utils'

import forge from '../forge'
import { schemas } from '../schema'
import type schema from '../schema'

type GetAPIKeyFunc = (
  id: string,
  pb: IPBService<typeof schema>
) => Promise<string>

type InferSchema<T extends keyof typeof schemas> = z.infer<(typeof schema)[T]>

type TransactionPrompt = InferSchema<'transactions_prompts'>
type TransactionTemplate = InferSchema<'transaction_templates'>

type ExtractedData = {
  date: string
  type: 'income' | 'expenses' | 'transfer'
  particulars?: string
  category?: string
  amount: number
  location?: string
  asset?: string | null
  from?: string | null
  to?: string | null
}

async function fetchInitialData(
  pb: IPBService<typeof schema>,
  getAPIKey: GetAPIKeyFunc
) {
  const [particularPrompt, categories, key, assets] = await Promise.all([
    pb.getFirstListItem
      .collection('transactions_prompts')
      .execute()
      .catch(() => {
        return null
      }),
    pb.getFullList
      .collection('categories')
      .execute()
      .catch(() => {
        return []
      }),
    getAPIKey('gcloud', pb).catch(() => {
      return null
    }),
    pb.getFullList
      .collection('assets')
      .execute()
      .catch(() => {
        return []
      })
  ])

  return {
    particularPrompt,
    categories,
    key,
    assets
  }
}

async function extractBasicDetails(
  fetchAI: FetchAIFunc,
  pb: IPBService<typeof schema>,
  description: string,
  todayStr: string,
  categoryNames: string[],
  assetNames: string[]
) {
  const hasCategories = categoryNames.length > 0

  const hasAssets = assetNames.length > 0

  const assetEnum = hasAssets ? z.enum(assetNames) : z.string()

  const FullTransactionDetails = z.discriminatedUnion('type', [
    z.object({
      date: z.string().describe('Transaction date in YYYY-MM-DD format'),
      type: z.literal('income').or(z.literal('expenses')),
      category: hasCategories
        ? z.enum(categoryNames).describe('The matched category')
        : z.string().describe('The matched category name'),
      amount: z.number().describe('Numeric amount without currency symbol'),
      location: z.string().describe('Location name or "Unknown"'),
      asset: assetEnum.describe(
        'The matched asset/wallet name from the available list'
      )
    }),
    z.object({
      date: z.string().describe('Transaction date in YYYY-MM-DD format'),
      type: z.literal('transfer'),
      amount: z.number().describe('Numeric amount without currency symbol'),
      from: assetEnum.describe('The source asset/wallet for the transfer'),
      to: assetEnum.describe('The destination asset/wallet for the transfer')
    })
  ])

  const TransactionsList = z.object({
    transactions: z
      .array(FullTransactionDetails)
      .describe('The list of extracted transactions')
  })

  const result = await fetchAI({
    pb,
    provider: 'deepseek',
    model: 'deepseek-v4-flash',
    messages: [
      {
        role: 'system',
        content: `You are an expert transaction extractor for personal finance software.
Your task is to analyze the receipt text or natural language input and extract structured details. The user might describe a single transaction or multiple transactions simultaneously. Identify and extract each individual transaction.

Strict Rules:
- If multiple transactions are mentioned or implied (e.g. "I spent 10 on food and 20 on coffee", "yesterday got 100 salary, today paid 50 for water"), extract each one as a separate element in the list.
- Identify the correct date of the transaction:
  - If an absolute date is provided (e.g. "May 25", "12/20/2025"), convert it to YYYY-MM-DD.
  - If a relative date or relative time context is provided (e.g. "today", "yesterday", "2 days ago", "last Friday", "yesterday afternoon", "3 hours ago"), you must calculate the exact calendar date in YYYY-MM-DD format based on the Current Reference Date: ${todayStr} (which represents today's date).
  - Never output descriptive relative terms (like "Today", "Yesterday", "2 days ago") in the date field; always output the calculated absolute calendar date in YYYY-MM-DD format.
- Determine transaction type: 'income', 'expenses', or 'transfer'.
  - For income or expenses: extract category, location, and the asset/wallet used.
  - For transfer: extract only date, amount, and the from/to assets (from, to). Skip category, location, and single asset.
- Extract the clean, numerical transaction amount without currency signs. CRITICAL: Never invent or assume an amount. Only extract an amount if it is explicitly stated in the description (e.g., "RM39", "$15", "50 dollars", "spent 20"). If no amount is explicitly mentioned, you MUST set amount to 0.
- Extract the merchant name/location ONLY if it is explicitly stated. Never guess, infer, or fabricate a location. If not explicitly stated, use "Unknown".
- Extract the payment asset/wallet used for the transaction. If the text does not contain any clue about which account or method was used, use "Unknown".

Available Categories: ${hasCategories ? categoryNames.join(', ') : 'None'}
Available Assets: ${hasAssets ? assetNames.join(', ') : 'None'}`
      },
      {
        role: 'user',
        content: description
      }
    ],
    structure: TransactionsList
  })

  return result
}

async function batchMatchTemplates(
  fetchAI: FetchAIFunc,
  pb: IPBService<typeof schema>,
  templates: TransactionTemplate[],
  transactions: ExtractedData[],
  description: string
): Promise<(TransactionTemplate | null)[]> {
  if (templates.length === 0 || transactions.length === 0) {
    return transactions.map(() => null)
  }

  const templateNames = templates.map(function (t) {
    return t.name
  })

  const BatchTemplateMatch = z.object({
    matches: z.array(
      z.object({
        transactionIndex: z
          .number()
          .describe('0-based index of the transaction in the input list'),
        template: z
          .enum(['None', ...templateNames])
          .describe(
            'Best matching template name, or None if there is no extremely close match'
          )
      })
    )
  })

  const formattedTransactions = transactions
    .map(function (tx, index) {
      return `Transaction #${index}:
- Type: ${tx.type}
- Amount: ${tx.amount}
- Category: ${tx.category || 'N/A'}
- Location: ${tx.location || 'Unknown'}`
    })
    .join('\n\n')

  const formattedTemplates = templates
    .map(function (t) {
      return `- [Type: ${t.type}] ${t.name}: ${t.particulars || 'N/A'} ${
        t.location_name ? `@ ${t.location_name}` : ''
      }`
    })
    .join('\n')

  const templateData = await fetchAI({
    pb,
    provider: 'deepseek',
    model: 'deepseek-v4-flash',
    messages: [
      {
        role: 'system',
        content: `You are a smart matching system that maps transactions to pre-defined user templates.
Your goal is to determine if each transaction in the list matches a template.

Strict Matching Rules:
- A transaction can ONLY match a template if they have the exact same type (e.g., an expenses transaction can only match an expenses template, and an income transaction can only match an income template).
- A match is ONLY valid if the merchant/location name or the specific item purchased matches the template's details.
- If the merchant/location, category, or descriptions are different (e.g., "The Library" vs "Lakeview Haus", or "book" vs "beverage"), they are absolutely NOT a match.
- If there is no extremely close match of the correct type, you MUST return 'None'.
- Do not make loose or creative associations. Be highly conservative and default to 'None'.

Slot Handling:
- Template particulars may contain placeholder slots indicated by various bracket styles like <slot_name>, {slot_name}, {{slot_name}}, [slot_name], (slot_name), etc. (e.g., <item>, {store}, {{service}}, [merchant]). These are empty slots to be filled with real values from the transaction.
- Consider a template with slots as a potential match - the slot indicates the template fits, with details to be filled in from the actual transaction.

Available Templates:
${formattedTemplates}`
      },
      {
        role: 'user',
        content: `Transactions to match:
${formattedTransactions}

Raw full input description context:
${description}`
      }
    ],
    structure: BatchTemplateMatch
  })

  const results = transactions.map(() => null as TransactionTemplate | null)

  if (templateData && templateData.matches) {
    for (const match of templateData.matches) {
      if (
        match.transactionIndex >= 0 &&
        match.transactionIndex < transactions.length &&
        match.template !== 'None'
      ) {
        const found = templates.find(function (t) {
          return t.name === match.template
        })

        if (found) {
          results[match.transactionIndex] = found
        }
      }
    }
  }

  return results
}

async function batchGenerateParticulars(
  fetchAI: FetchAIFunc,
  pb: IPBService<typeof schema>,
  transactions: ExtractedData[],
  particularPrompt: TransactionPrompt | null,
  description: string,
  baseParticularsMap: Map<number, string | undefined>
): Promise<Map<number, string>> {
  const results = new Map<number, string>()

  const activeTransactions = transactions
    .map(function (tx, index) {
      return { tx, index }
    })
    .filter(function (item) {
      return item.tx.type !== 'transfer'
    })

  if (activeTransactions.length === 0) {
    return results
  }

  const todayStr = dayjs().format('YYYY-MM-DD')

  let particularsPrompt = `You are a copywriter generating clean, concise transaction summaries (particulars) for personal finance ledgers.
Analyze the transaction list and describe only the purchase item or nature of the transaction for each item (5 to 10 words).

Strict Rules:
1. Do NOT include payment methods, card names, or wallets (e.g., "using MAE Wallet", "with Visa", "by card", "credit card", "wallet").
2. Do NOT include dates, relative times, or days of week (e.g., "last Sunday", "today", "yesterday", "Sunday").
3. Do NOT include transaction amounts or currencies (e.g., "RM39", "$15").
4. Do NOT include location names or merchants (e.g., "at The Library", "Tesco", "Starbucks"). Locations are stored separately in the location field, so they must be excluded from the particulars.
5. Under no circumstances should any asset/wallet name, payment method, amount, date, day of week, relative time words, or location name be included in the particulars.

Few-Shot Examples:
- Input transaction: "Spend RM39 for the purchase of book at The Library by BookXCess last sunday using MAE Wallet"
  Particulars: "Purchase of book"

- Input transaction: "Starbucks coffee for $5.50 this morning with Visa Card"
  Particulars: "Coffee"

- Input transaction: "Bought groceries at Tesco yesterday for RM120 using Cash"
  Particulars: "Groceries"

Now analyze the list of user transactions and generate the clean, concise particulars for each.`

  if (particularPrompt) {
    particularsPrompt += `\n\nCustom Guideline Reference (if available/applicable):
Income Guideline: ${particularPrompt.income || 'N/A'}
Expenses Guideline: ${particularPrompt.expenses || 'N/A'}`
  }

  const formattedItems = activeTransactions
    .map(function (item) {
      const basePart = baseParticularsMap.get(item.index)

      let itemContext = `Transaction #${item.index}:
- Type: ${item.tx.type}
- Amount: ${item.tx.amount}
- Category: ${item.tx.category || 'N/A'}
- Location: ${item.tx.location || 'Unknown'}`

      if (basePart) {
        itemContext += `\n- Base template reference particulars: "${basePart}". (This template may contain placeholder slots like <slot_name>, {slot_name}, {{slot_name}}, etc. Fill those slots with actual values from the transaction description to produce a concrete summary.)`
      }

      return itemContext
    })
    .join('\n\n')

  const ParticularsListSchema = z.object({
    particularsList: z.array(
      z.object({
        transactionIndex: z
          .number()
          .describe('0-based index of the transaction in the input list'),
        particulars: z
          .string()
          .describe(
            'Clean transaction particulars (5-10 words). MUST NOT contain dates, times, day of week, amounts, payment asset names, or location names.'
          )
      })
    )
  })

  const particularsData = await fetchAI({
    pb,
    provider: 'deepseek',
    model: 'deepseek-v4-flash',
    messages: [
      {
        role: 'system',
        content: particularsPrompt
      },
      {
        role: 'user',
        content: `Transactions to summarize:
${formattedItems}

Current Reference Date: ${todayStr}
Raw full input description context:
${description}`
      }
    ],
    structure: ParticularsListSchema
  })

  if (particularsData && particularsData.particularsList) {
    for (const item of particularsData.particularsList) {
      results.set(item.transactionIndex, item.particulars)
    }
  }

  for (const item of activeTransactions) {
    if (!results.has(item.index)) {
      results.set(item.index, item.tx.particulars || 'Transaction')
    }
  }

  return results
}

type ResolvedLocation = {
  coords: { lon: number; lat: number }
  name: string
}

async function resolveLocationCoords(
  searchLocations: SearchLocationsFunc,
  key: string | null,
  locationName: string
): Promise<ResolvedLocation | null> {
  if (!key || !locationName || locationName === 'Unknown') {
    return null
  }

  const locations = await searchLocations(key, locationName).catch(() => {
    return []
  })

  if (locations.length > 0) {
    return {
      coords: {
        lon: locations[0].location.longitude,
        lat: locations[0].location.latitude
      },
      name: locations[0].name
    }
  }

  return null
}

async function batchResolveLocationCoords(
  searchLocations: SearchLocationsFunc,
  key: string | null,
  transactions: ExtractedData[]
): Promise<Map<string, ResolvedLocation | null>> {
  const resultMap = new Map<string, ResolvedLocation | null>()

  if (!key) return resultMap

  const uniqueLocations = [
    ...new Set(
      transactions
        .map(function (tx) {
          return tx.location
        })
        .filter(function (loc): loc is string {
          return !!loc && loc !== 'Unknown'
        })
    )
  ]

  const resolved = await Promise.all(
    uniqueLocations.map(async function (loc) {
      const resolvedLoc = await resolveLocationCoords(searchLocations, key, loc)

      return { loc, resolvedLoc }
    })
  )

  for (const { loc, resolvedLoc } of resolved) {
    resultMap.set(loc, resolvedLoc)
  }

  return resultMap
}

export const fromNaturalLanguage = forge
  .mutation({
    description:
      'Convert human natural language into partial transaction object',
    input: {
      body: z.object({
        description: z.string()
      })
    },
    output: {
      OK: z.array(
        z.object({
          date: z.string(),
          amount: z.number(),
          type: z.enum(['income', 'expenses', 'transfer']),
          category: z.string().nullable(),
          particulars: z.string(),
          location_coords: z.object({
            lon: z.number(),
            lat: z.number()
          }),
          location_name: z.string(),
          asset: z.string().optional(),
          from: z.string().optional(),
          to: z.string().optional(),
          ledgers: z.array(z.string()).optional()
        })
      )
    }
  })
  .callback(async function ({
    response,
    pb,
    body: { description },
    core: {
      api: { fetchAI, getAPIKey, searchLocations }
    }
  }) {
    const todayStr = dayjs().format('YYYY-MM-DD')

    // 1. Fetch initial data from DB
    const { particularPrompt, categories, key, assets } =
      await fetchInitialData(pb, getAPIKey)

    // Map categories and assets
    const categoryMap = new Map(
      categories.map(function (c) {
        return [c.name, c.id]
      })
    )

    const categoryNames = categories.map(function (c) {
      return c.name
    })

    const assetMap = new Map(
      assets.map(function (a) {
        return [a.name, a.id]
      })
    )

    const assetNames = assets.map(function (a) {
      return a.name
    })

    // 2. Extract basic transaction details
    const extractedData = await extractBasicDetails(
      fetchAI,
      pb,
      description,
      todayStr,
      categoryNames,
      assetNames
    )

    if (!extractedData || !extractedData.transactions) {
      throw new Error('Failed to extract transaction details')
    }

    const allTemplates = await pb.getFullList
      .collection('transaction_templates')
      .execute()
      .catch(() => {
        return []
      })

    // Batch match templates for all transactions
    const matchedTemplates = await batchMatchTemplates(
      fetchAI,
      pb,
      allTemplates,
      extractedData.transactions,
      description
    )

    // Construct base particulars map
    const baseParticularsMap = new Map<number, string | undefined>()
    extractedData.transactions.forEach((tx, idx) => {
      const template = matchedTemplates[idx]

      if (template) {
        baseParticularsMap.set(idx, template.particulars || undefined)
      }
    })

    // Batch generate particulars for all transactions
    const particularsMap = await batchGenerateParticulars(
      fetchAI,
      pb,
      extractedData.transactions,
      particularPrompt,
      description,
      baseParticularsMap
    )

    // Batch resolve all unique locations before processing transactions
    const locationCoordsMap = await batchResolveLocationCoords(
      searchLocations,
      key,
      extractedData.transactions
    )

    const results = await Promise.all(
      extractedData.transactions.map(async function (item, idx) {
        if (item.type === 'transfer') {
          return {
            date: item.date,
            type: 'transfer' as const,
            amount: item.amount,
            category: null,
            particulars: '',
            location_coords: { lon: 0, lat: 0 },
            location_name: '',
            from:
              item.from && item.from !== 'Unknown'
                ? assetMap.get(item.from)
                : undefined,
            to:
              item.to && item.to !== 'Unknown'
                ? assetMap.get(item.to)
                : undefined
          }
        }

        const matchedTemplate = matchedTemplates[idx]

        const finalResult: {
          date: string
          type: 'income' | 'expenses' | 'transfer'
          amount: number
          category: string | null
          particulars: string
          location_coords: {
            lon: number
            lat: number
          }
          location_name: string
          asset: string | undefined
          ledgers: string[] | undefined
        } = {
          date: item.date,
          type: item.type,
          amount: item.amount,
          category: categoryMap.get(item.category) || item.category || null,
          particulars: particularsMap.get(idx) || '',
          location_coords: {
            lon: 0,
            lat: 0
          },
          location_name: '',
          asset:
            item.asset && item.asset !== 'Unknown'
              ? assetMap.get(item.asset)
              : undefined,
          ledgers: undefined
        }

        if (matchedTemplate) {
          if (matchedTemplate.category) {
            finalResult.category = matchedTemplate.category
          }

          if (matchedTemplate.location_name) {
            finalResult.location_name = matchedTemplate.location_name
          }

          if (
            matchedTemplate.location_coords &&
            (matchedTemplate.location_coords.lon !== 0 ||
              matchedTemplate.location_coords.lat !== 0)
          ) {
            finalResult.location_coords = matchedTemplate.location_coords
          }

          if (
            finalResult.amount === 0 &&
            matchedTemplate.amount !== undefined &&
            matchedTemplate.amount !== null &&
            matchedTemplate.amount > 0
          ) {
            finalResult.amount = matchedTemplate.amount
          }

          if (matchedTemplate.ledgers && matchedTemplate.ledgers.length > 0) {
            finalResult.ledgers = matchedTemplate.ledgers
          }
        }

        // 5. Resolve location coordinates from pre-resolved map if not already set by template
        if (!finalResult.location_name?.trim()) {
          const resolvedLoc = locationCoordsMap.get(item.location) || null

          if (resolvedLoc) {
            finalResult.location_coords = resolvedLoc.coords
            finalResult.location_name = resolvedLoc.name
          }
        }

        // 6. Fallback to template asset if AI didn't resolve one
        if (!finalResult.asset && matchedTemplate?.asset) {
          finalResult.asset = matchedTemplate.asset
        }

        return finalResult
      })
    )

    return response.ok(results)
  })
