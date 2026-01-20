import prompts from 'prompts'

import logger from '@/utils/logger'

export default async function selectIcon(): Promise<string> {
  const iconCollections = (await fetch(
    'https://api.iconify.design/collections'
  ).then(res => res.json())) as Record<
    string,
    {
      name: string
      total: number
      categories?: Record<string, string[]>
      uncategorized?: string[]
    }
  >

  if (!iconCollections) {
    logger.error('Failed to fetch icon collections from Iconify.')
    process.exit(1)
  }

  const iconCollectionsList = Object.keys(iconCollections)

  while (true) {
    let cancelled = false

    const moduleIconCollection = await prompts(
      {
        type: 'autocomplete',
        name: 'iconCollection',
        message: 'Select an icon set:',
        choices: iconCollectionsList.map(iconCollection => ({
          title: `${iconCollection}: ${
            iconCollections[iconCollection]?.name
          } (${iconCollections[iconCollection]?.total.toLocaleString()} icons)`,
          value: iconCollection
        })),
        validate: value =>
          value.length === 0
            ? 'You must select an icon set.'
            : !iconCollectionsList.includes(value)
              ? 'Invalid icon set selected.'
              : true
      },
      {
        onCancel: () => {
          cancelled = true
        }
      }
    )

    if (!moduleIconCollection.iconCollection) {
      logger.error('Please select a valid icon set.')
      continue
    }

    if (cancelled) {
      logger.error('Icon selection cancelled by user.')
      process.exit(1)
    }

    let icons: {
      [key: string]: string[]
    }[] = []

    try {
      icons = await fetch(
        `https://api.iconify.design/collection?prefix=${moduleIconCollection.iconCollection}`
      ).then(res => res.json())
    } catch (error) {
      logger.error(
        `Error fetching icons for collection ${moduleIconCollection.iconCollection}: ${error}`
      )
      continue
    }

    if (!icons) {
      logger.error('Failed to fetch icons from Iconify.')
      process.exit(1)
    }

    const iconsList = [
      // @ts-expect-error - lazy to add types
      ...(icons.uncategorized ?? []),
      // @ts-expect-error - lazy to add types
      ...Object.values(icons.categories ?? {}).flat()
    ]

    let cancelled2 = false

    const moduleIcon = await prompts(
      {
        type: 'autocomplete',
        name: 'icon',
        message: 'Select an icon:',
        choices: [
          {
            title: `../ (Back to icon sets)`,
            value: 'GO_BACK'
          },
          ...iconsList.map((icon: string) => ({
            title: icon,
            value: `${moduleIconCollection.iconCollection}:${icon}`
          }))
        ],
        initial: false,
        suggest: async (input, choices) => {
          if (!input) {
            return choices
          }

          const filteredChoices = choices
            .filter(choice =>
              choice.title.toLowerCase().includes(input.toLowerCase())
            )
            .sort((a, b) => {
              const inputLower = input.toLowerCase()

              const aTitleLower = a.title.toLowerCase()

              const bTitleLower = b.title.toLowerCase()

              if (aTitleLower === inputLower && bTitleLower !== inputLower)
                return -1
              if (bTitleLower === inputLower && aTitleLower !== inputLower)
                return 1

              const aStartsWith = aTitleLower.startsWith(inputLower)

              const bStartsWith = bTitleLower.startsWith(inputLower)

              if (aStartsWith && !bStartsWith) return -1
              if (bStartsWith && !aStartsWith) return 1

              const aIndex = aTitleLower.indexOf(inputLower)

              const bIndex = bTitleLower.indexOf(inputLower)

              if (aIndex !== bIndex) return aIndex - bIndex

              if (a.title.length !== b.title.length)
                return a.title.length - b.title.length

              return a.title.localeCompare(b.title)
            })

          return filteredChoices
        }
      },
      {
        onCancel: () => {
          cancelled2 = true
        }
      }
    )

    if (cancelled2) {
      logger.error('Icon selection cancelled by user.')
      process.exit(1)
    }

    if (moduleIcon.icon === 'GO_BACK') {
      continue
    }

    return moduleIcon.icon
  }
}
