import dotenv from 'dotenv'
import createModule from './core/createModule'
import listModule from './core/listModule'
import printHelp from './utils/printHelp'

dotenv.config({
  path: '.env.development.local'
})

function parseArgs(): Record<string, string> {
  const args = process.argv.slice(3)
  const parsedArgs: Record<string, string> = {}
  for (let i = 0; i < args.length; i += 2) {
    parsedArgs[args[i].replace(/^-+/, '')] = args[i + 1]
  }
  return parsedArgs
}

const command = process.argv[2]
const args = parseArgs()
let lang: 'en' | 'zh-CN' | 'zh-TW' | 'ms' = 'en'

if (args.language !== undefined || args.l !== undefined) {
  if (['en', 'zh-CN', 'zh-TW', 'ms'].includes(args.language ?? args.l)) {
    lang = (args.language ?? args.l) as 'en' | 'zh-CN' | 'zh-TW' | 'ms'
  } else {
    console.error('Invalid language')
    process.exit(1)
  }
}

let username = ''
let password = ''

if (args.username !== undefined || args.u !== undefined) {
  username = args.username ?? args.u
}

if (args.password !== undefined || args.p !== undefined) {
  password = args.password ?? args.p
}

if (args.help !== undefined || args.h !== undefined) {
  printHelp(t)
  process.exit(0)
}

const translations = await fetch(
  `${process.env.VITE_API_HOST}/locales/${lang}`
).then(async res => {
  const translations = await res.json()
  return translations
})

function t(key: string): string {
  try {
    const keys = key.split('.')
    let value = translations
    for (const k of keys) {
      value = value[k]
    }
    return value ?? key
  } catch {
    return key
  }
}

switch (command) {
  case 'list':
    listModule(username, password, t).catch(console.error)
    break
  case 'create':
    createModule(username, password, t).catch(console.error)
    break
  default:
    printHelp(t)
    break
}
