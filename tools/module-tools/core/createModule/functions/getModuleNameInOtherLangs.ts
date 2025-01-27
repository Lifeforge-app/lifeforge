import ora from 'ora'
import prompts from 'prompts'

async function getModuleNameInOtherLangs({
  login,
  moduleName
}: {
  login: any
  moduleName: string
}): Promise<{
  moduleNameZHCN: string
  moduleNameZHTW: string
  moduleNameMS: string
} | null> {
  const spinner = ora('Fetching translation suggestions...').start()

  const translationSuggestions = await fetch(
    `${process.env.VITE_API_HOST}/locales/ai-generate/module-name`,
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

  const { ms, 'zh-CN': zhCN, 'zh-TW': zhTW } = translationSuggestions.data

  const moduleNameZHCN = await prompts({
    type: 'text',
    name: 'moduleName',
    message: 'Module name (in Simplified Chinese)',
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
    message: 'Module name (in Traditional Chinese)',
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

  const moduleNameMS = await prompts({
    type: 'text',
    name: 'moduleName',
    message: 'Module name (in Malay)',
    initial: ms,
    validate: value => {
      if (!value) {
        return 'Module name is required'
      }
      return true
    }
  })

  if (!moduleNameMS.moduleName) {
    return null
  }

  return {
    moduleNameZHCN: moduleNameZHCN.moduleName,
    moduleNameZHTW: moduleNameZHTW.moduleName,
    moduleNameMS: moduleNameMS.moduleName
  }
}

export default getModuleNameInOtherLangs
