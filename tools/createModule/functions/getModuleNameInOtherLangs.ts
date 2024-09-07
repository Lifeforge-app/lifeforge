/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import ora from 'ora'
import prompts from 'prompts'

async function getModuleNameInOtherLangs({
  login,
  moduleID
}: {
  login: any
  moduleID: string
}): Promise<{
  moduleNameZHCN: string
  moduleNameZHTW: string
  moduleNameMY: string
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
        key: `modules.${moduleID[0].toLowerCase() + moduleID.slice(1)}`
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

  const moduleNameZHCN = await prompts({
    type: 'text',
    name: 'moduleName',
    message: 'Enter the module name (in Simplified Chinese)',
    initial: zhCN,
    validate: value => {
      if (!value) {
        return 'Module name is required'
      }
      return true
    }
  })

  if (!moduleNameZHCN.moduleName) {
    return null
  }

  const moduleNameZHTW = await prompts({
    type: 'text',
    name: 'moduleName',
    message: 'Enter the module name (in Traditional Chinese)',
    initial: zhTW,
    validate: value => {
      if (!value) {
        return 'Module name is required'
      }
      return true
    }
  })

  if (!moduleNameZHTW.moduleName) {
    return null
  }

  const moduleNameMY = await prompts({
    type: 'text',
    name: 'moduleName',
    message: 'Enter the module name (in Malay)',
    initial: ms,
    validate: value => {
      if (!value) {
        return 'Module name is required'
      }
      return true
    }
  })

  if (!moduleNameMY.moduleName) {
    return null
  }

  return {
    moduleNameZHCN: moduleNameZHCN.moduleName,
    moduleNameZHTW: moduleNameZHTW.moduleName,
    moduleNameMY: moduleNameMY.moduleName
  }
}

export default getModuleNameInOtherLangs
