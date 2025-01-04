import chalk from 'chalk'
import ora from 'ora'

async function saveTranslation({
  key,
  en,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  ms,
  login
}: {
  key: string
  en: string
  'zh-CN': string
  'zh-TW': string
  ms: string
  login: any
}): Promise<boolean> {
  const spinner = ora('Saving translations...').start()

  const translations = await fetch(`${process.env.VITE_API_HOST}/locales`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${login.token}`
    },
    body: JSON.stringify({
      key,
      translations: {
        en,
        'zh-CN': zhCN,
        'zh-TW': zhTW,
        ms
      }
    })
  })
    .then(async res => await res.json())
    .catch(console.error)
    .finally(() => spinner.stop())

  if (translations.state === 'error') {
    console.error('Failed to save translations')
    return false
  }

  console.log(chalk.green('✔ Translations saved successfully'))

  return true
}

export default saveTranslation
