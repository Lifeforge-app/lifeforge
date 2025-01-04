/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import ora from 'ora'
import prompts from 'prompts'
import { errorAndProceed } from '../../../utils/errorAndProceed'

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
  moduleDescMS: string
} | null> {
  const translationSuggestions = await getTranslationSuggestions(
    login,
    moduleName
  )

  if (!translationSuggestions) {
    return null
  }

  const result = {
    moduleDescEN: '',
    moduleDescZHCN: '',
    moduleDescZHTW: '',
    moduleDescMS: ''
  }

  for (const key in translationSuggestions.data) {
    let response

    while (true) {
      response = await prompts({
        type: 'text',
        name: 'moduleDesc',
        message: `Module description (in ${
          {
            en: 'English',
            ms: 'Malay',
            'zh-CN': 'Simplified Chinese',
            'zh-TW': 'Traditional Chinese'
          }[key]
        })`,
        initial: `${
          translationSuggestions.data[key] || ''
        } (Type "r" and press enter to get a new suggestion)`,
        validate: value => {
          if (!value) {
            return 'Module description is required'
          }
          return true
        }
      })

      if (!response.moduleDesc) {
        await errorAndProceed('Module description is required')
        continue
      }

      if (response.moduleDesc === 'r') {
        const ts = await getTranslationSuggestions(login, moduleName)

        if (!ts) {
          return null
        }

        translationSuggestions.data = ts.data
        continue
      }

      result[
        `moduleDesc${key.replace('-', '').toUpperCase()}` as keyof typeof result
      ] = response.moduleDesc.replace(
        " (Type 'r' and press enter to get a new suggestion)",
        ''
      )
      break
    }
  }

  return result
}

export default getModuleDescInOtherLangs
