import axios from 'axios'
import ora from 'ora'
import prompts from 'prompts'

import CLILoggingService from '@/utils/logging'

export default async function selectIcon(): Promise<string> {
  const iconCollections = (
    await axios.get<
      Record<
        string,
        {
          name: string
          total: number
          categories?: Record<string, string[]>
          uncategorized?: string[]
        }
      >
    >('https://api.iconify.design/collections')
  ).data

  if (!iconCollections) {
    CLILoggingService.error('Failed to fetch icon collections from Iconify.')
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
      CLILoggingService.error('Please select a valid icon set.')
      continue
    }

    if (cancelled) {
      CLILoggingService.error('Icon selection cancelled by user.')
      process.exit(1)
    }

    const spinner2 = ora('Fetching icons from Iconify...').start()

    let icons: {
      [key: string]: string[]
    }[] = []

    try {
      icons = (
        await axios(
          `https://api.iconify.design/collection?prefix=${moduleIconCollection.iconCollection}`
        )
      ).data
    } catch (error) {
      spinner2.fail('Failed to fetch icons from Iconify.')
      CLILoggingService.error(
        `Error fetching icons for collection ${moduleIconCollection.iconCollection}: ${error}`
      )
      continue
    }

    spinner2.stop()

    if (!icons) {
      CLILoggingService.error('Failed to fetch icons from Iconify.')
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
      CLILoggingService.error('Icon selection cancelled by user.')
      process.exit(1)
    }

    if (moduleIcon.icon === 'GO_BACK') {
      continue
    }

    return moduleIcon.icon
  }
}
