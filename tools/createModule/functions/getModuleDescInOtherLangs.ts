/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import ora from 'ora'
import prompts from 'prompts'
import { errorAndProceed } from '../utils/errorAndProceed'

async function getTranslationSuggestions(
  login: any,
  moduleName: string
): Promise<any | null> {
  const spinner = ora('Fetching translation suggestions...').start()

  const translationSuggestions = await fetch(
    `${process.env.VITE_API_HOST}/locales/ai-generate/module-description`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${login.token}`
      },
      body: JSON.stringify({
        name: moduleName
      })
    }
  )
    .then(async res => await res.json())
    .catch(console.error)
    .finally(() => spinner.stop())

  if (translationSuggestions.state === 'error') {
    console.error('Failed to fetch translation suggestions')
    return null
  }

  return translationSuggestions
}

async function getModuleDescInOtherLangs({
  login,
  moduleName
}: {
  login: any
  moduleName: string
}): Promise<{
  moduleDescEN: string
  moduleDescZHCN: string
  moduleDescZHTW: string
  moduleDescMY: string
} | null> {
  const translationSuggestions = await getTranslationSuggestions(
    login,
    moduleName
  )

  if (!translationSuggestions) {
    return null
  }

  let { en, ms, 'zh-CN': zhCN, 'zh-TW': zhTW } = translationSuggestions.data

  let moduleDescEN

  while (true) {
    moduleDescEN = await prompts({
      type: 'text',
      name: 'moduleDesc',
      message: 'Module description (in English)',
      initial: `${en} (Type "r" and press enter to get a new suggestion)`,
      validate: value => {
        if (!value) {
          return 'Module description is required'
        }
        return true
      }
    })

    if (!moduleDescEN.moduleDesc) {
      await errorAndProceed('Module description is required')
      continue
    }

    if (moduleDescEN.moduleDesc === 'r') {
      const translationSuggestions = await getTranslationSuggestions(
        login,
        moduleName
      )

      if (!translationSuggestions) {
        return null
      }

      en = translationSuggestions.data.en
      continue
    }

    break
  }

  let moduleDescZHCN

  while (true) {
    moduleDescZHCN = await prompts(
      {
        type: 'text',
        name: 'moduleDesc',
        message: 'Module description (in Simplified Chinese)',
        initial: `${zhCN} (Type "r" and press enter to get a new suggestion)`,
        validate: value => {
          if (!value) {
            return 'Module description is required'
          }
          return true
        }
      },
      { onCancel: () => process.exit(0) }
    )

    if (!moduleDescZHCN.moduleDesc) {
      await errorAndProceed('Module description is required')
      continue
    }

    if (moduleDescZHCN.moduleDesc === 'r') {
      const translationSuggestions = await getTranslationSuggestions(
        login,
        moduleName
      )

      if (!translationSuggestions) {
        return null
      }

      zhCN = translationSuggestions.data['zh-CN']
      continue
    }

    break
  }

  let moduleDescZHTW
  while (true) {
    moduleDescZHTW = await prompts({
      type: 'text',
      name: 'moduleDesc',
      message: 'Module description (in Traditional Chinese)',
      initial: `${zhTW} (Type "r" and press enter to get a new suggestion)`,
      validate: value => {
        if (!value) {
          return 'Module description is required'
        }
        return true
      }
    })

    if (!moduleDescZHTW.moduleDesc) {
      await errorAndProceed('Module description is required')
      continue
    }

    if (moduleDescZHTW.moduleDesc === 'r') {
      const translationSuggestions = await getTranslationSuggestions(
        login,
        moduleName
      )

      if (!translationSuggestions) {
        return null
      }

      zhTW = translationSuggestions.data['zh-TW']
      continue
    }

    break
  }

  let moduleDescMY
  while (true) {
    moduleDescMY = await prompts({
      type: 'text',
      name: 'moduleDesc',
      message: 'Module description (in Malay)',
      initial: `${ms} (Type "r" and press enter to get a new suggestion)`,
      validate: value => {
        if (!value) {
          return 'Module description is required'
        }
        return true
      }
    })

    if (!moduleDescMY.moduleDesc) {
      await errorAndProceed('Module description is required')
      continue
    }

    if (moduleDescMY.moduleDesc === 'r') {
      const translationSuggestions = await getTranslationSuggestions(
        login,
        moduleName
      )

      if (!translationSuggestions) {
        return null
      }

      ms = translationSuggestions.data.ms
      continue
    }

    break
  }

  return {
    moduleDescEN: moduleDescEN.moduleDesc,
    moduleDescZHCN: moduleDescZHCN.moduleDesc,
    moduleDescZHTW: moduleDescZHTW.moduleDesc,
    moduleDescMY: moduleDescMY.moduleDesc
  }
}

export default getModuleDescInOtherLangs
