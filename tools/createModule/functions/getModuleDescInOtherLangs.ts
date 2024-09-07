/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import ora from 'ora'
import prompts from 'prompts'

async function getModuleDescInOtherLangs({
  login,
  moduleDesc
}: {
  login: any
  moduleDesc: string
}): Promise<{
  moduleDescZHCN: string
  moduleDescZHTW: string
  moduleDescMY: string
} | null> {
  const spinner = ora('Fetching translation suggestions...').start()

  const translationSuggestions = await fetch(
    `${process.env.VITE_API_HOST}/locales/ai-generate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${login.token}`
      },
      body: JSON.stringify({
        key: moduleDesc
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

  const { ms, 'zh-CN': zhCN, 'zh-TW': zhTW } = translationSuggestions.data

  const moduleDescZHCN = await prompts({
    type: 'text',
    name: 'moduleDesc',
    message: 'Enter the module description (in Simplified Chinese)',
    initial: zhCN,
    validate: value => {
      if (!value) {
        return 'Module description is required'
      }
      return true
    }
  })

  if (!moduleDescZHCN.moduleDesc) {
    return null
  }

  const moduleDescZHTW = await prompts({
    type: 'text',
    name: 'moduleDesc',
    message: 'Enter the module description (in Traditional Chinese)',
    initial: zhTW,
    validate: value => {
      if (!value) {
        return 'Module description is required'
      }
      return true
    }
  })

  if (!moduleDescZHTW.moduleDesc) {
    return null
  }

  const moduleDescMY = await prompts({
    type: 'text',
    name: 'moduleDesc',
    message: 'Enter the module description (in Malay)',
    initial: ms,
    validate: value => {
      if (!value) {
        return 'Module description is required'
      }
      return true
    }
  })

  if (!moduleDescMY.moduleDesc) {
    return null
  }

  return {
    moduleDescZHCN: moduleDescZHCN.moduleDesc,
    moduleDescZHTW: moduleDescZHTW.moduleDesc,
    moduleDescMY: moduleDescMY.moduleDesc
  }
}

export default getModuleDescInOtherLangs
