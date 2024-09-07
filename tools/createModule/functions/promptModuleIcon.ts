/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import ora from 'ora'
import prompts from 'prompts'

async function promptModuleIcon(): Promise<string | null> {
  const spinner = ora('Fetching icon collections from Iconify...').start()

  const iconCollections = await fetch('https://api.iconify.design/collections')
    .then(async res => await res.json())
    .catch(console.error)
    .finally(() => spinner.stop())

  if (!iconCollections) {
    console.error('Failed to fetch icon collections')
    return null
  }

  const iconCollectionsList = Object.keys(iconCollections)

  const moduleIconCollection = await prompts({
    type: 'autocomplete',
    name: 'iconCollection',
    message: 'Select an icon collection',
    choices: iconCollectionsList.map(iconCollection => ({
      title: `${iconCollection}: ${
        iconCollections[iconCollection].name
      } (${iconCollections[iconCollection].total.toLocaleString()} icons)`,
      value: iconCollection
    }))
  })

  if (!moduleIconCollection.iconCollection) {
    return null
  }

  const spinner2 = ora('Fetching icons from Iconify...').start()

  const icons = await fetch(
    `https://api.iconify.design/collection?prefix=${moduleIconCollection.iconCollection}`
  )
    .then(async res => await res.json())
    .catch(console.error)
    .finally(() => spinner2.stop())

  if (!icons) {
    console.error('Failed to fetch icons')
    return null
  }

  const iconsList = [
    ...(icons.uncategorized ?? []),
    ...Object.values(icons.categories ?? {}).flat()
  ]

  const moduleIcon = await prompts({
    type: 'autocomplete',
    name: 'icon',
    message: 'Select an icon',
    choices: iconsList.map((icon: string) => ({
      title: icon,
      value: `${moduleIconCollection.iconCollection}:${icon}`
    }))
  })

  if (!moduleIcon.icon) {
    return null
  }

  return moduleIcon.icon
}

export default promptModuleIcon
