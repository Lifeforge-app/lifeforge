import ClientError from '@functions/ClientError'
import { fetchAI } from '@functions/fetchAI'
import fs from 'fs'
import { z } from 'zod'

import { ALLOWED_LANG, ALLOWED_NAMESPACE } from '../../../constants/locales'

export const listSubnamespaces = (
  namespace: (typeof ALLOWED_NAMESPACE)[number]
): string[] => {
  if (namespace === 'apps') {
    const data = fs
      .readdirSync(`${process.cwd()}/src/apps`)
      .filter(module =>
        fs.existsSync(`${process.cwd()}/src/apps/${module}/locales/en.json`)
      )
      .map(module => module.replace('.json', ''))

    return data
  }

  const data = fs
    .readdirSync(`${process.cwd()}/src/core/locales/en/${namespace}`)
    .map(file => file.replace('.json', ''))

  return data
}

export const listLocales = (
  namespace: (typeof ALLOWED_NAMESPACE)[number],
  subnamespace: string
): Record<string, string> => {
  const final: Omit<Record<(typeof ALLOWED_LANG)[number], any>, 'zh'> = {
    en: {},
    ms: {},
    'zh-CN': {},
    'zh-TW': {}
  }

  if (namespace === 'apps') {
    if (!fs.existsSync(`${process.cwd()}/src/apps/${subnamespace}/locales`)) {
      throw new ClientError(
        `Subnamespace ${subnamespace} does not exist in apps`,
        404
      )
    }

    for (const lang of ALLOWED_LANG.filter(lng => lng !== 'zh')) {
      final[lang] = JSON.parse(
        fs.readFileSync(
          `${process.cwd()}/src/apps/${subnamespace}/locales/${lang}.json`,
          'utf-8'
        )
      )
    }
  } else {
    for (const lng of ALLOWED_LANG.filter(lng => lng !== 'zh')) {
      if (
        !fs.existsSync(
          `${process.cwd()}/src/core/locales/${lng}/${namespace}/${subnamespace}.json`
        )
      ) {
        throw new ClientError(
          `Subnamespace ${subnamespace} does not exist in namespace ${namespace}`,
          404
        )
      }

      final[lng] = JSON.parse(
        fs.readFileSync(
          `${process.cwd()}/src/core/locales/${lng}/${namespace}/${subnamespace}.json`,
          'utf-8'
        )
      )
    }
  }

  return final
}

export const syncLocales = (
  data: Record<
    string,
    Omit<Record<(typeof ALLOWED_LANG)[number], string>, 'zh'>
  >,
  namespace: (typeof ALLOWED_NAMESPACE)[number],
  subnamespace: string
): boolean => {
  let fileContent

  if (namespace === 'apps') {
    fileContent = ['en', 'ms', 'zh-CN', 'zh-TW'].reduce<Record<string, any>>(
      (acc, lang) => {
        const path = `${process.cwd()}/src/apps/${subnamespace}/locales/${lang}.json`

        if (fs.existsSync(path)) {
          acc[lang] = JSON.parse(fs.readFileSync(path, 'utf-8'))
        } else {
          acc[lang] = {}
        }

        return acc
      },
      {}
    )
  } else {
    fileContent = ['en', 'ms', 'zh-CN', 'zh-TW'].reduce<Record<string, any>>(
      (acc, lang) => {
        const path = `${process.cwd()}/src/core/locales/${lang}/${namespace}/${subnamespace}.json`

        if (fs.existsSync(path)) {
          acc[lang] = JSON.parse(fs.readFileSync(path, 'utf-8'))
        } else {
          acc[lang] = {}
        }

        return acc
      },
      {}
    )
  }

  for (const key in data) {
    for (const lang in data[key]) {
      const target = key
        .split('.')
        .slice(0, -1)
        .reduce((acc, cur) => {
          if (!acc[cur]) {
            acc[cur] = {}
          }

          return acc[cur]
        }, fileContent[lang])

      target[key.split('.').pop() as keyof typeof target] =
        data[key][lang as 'en' | 'ms' | 'zh-CN' | 'zh-TW']
    }
  }

  if (namespace === 'apps') {
    for (const lang in fileContent) {
      fs.writeFileSync(
        `${process.cwd()}/src/apps/${subnamespace}/locales/${lang}.json`,
        JSON.stringify(fileContent[lang], null, 2)
      )
    }
  } else {
    for (const lang in fileContent) {
      fs.writeFileSync(
        `${process.cwd()}/src/core/locales/${lang}/${namespace}/${subnamespace}.json`,
        JSON.stringify(fileContent[lang], null, 2)
      )
    }
  }

  return true
}

export const createLocale = (
  type: 'folder' | 'entry',
  namespace: (typeof ALLOWED_NAMESPACE)[number],
  subnamespace: string,
  path: string
): boolean => {
  for (const lang of ['en', 'ms', 'zh-CN', 'zh-TW']) {
    const filePath =
      namespace === 'apps'
        ? `${process.cwd()}/src/apps/${subnamespace}/locales/${lang}.json`
        : `${process.cwd()}/src/core/locales/${lang}/${namespace}/${subnamespace}.json`

    const data: Record<string, any> = JSON.parse(
      fs.readFileSync(filePath, 'utf-8')
    )

    const splitted: string[] = path.split('.')

    const key = splitted.pop()

    const target = splitted.reduce((acc, cur) => {
      if (!acc[cur]) {
        acc[cur] = {}
      }

      return acc[cur]
    }, data)

    if (target[key as string] !== undefined) {
      throw new ClientError(`Key ${key} already exists in path ${path}`)
    }

    target[key as string] = type === 'entry' ? '' : {}

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  }

  return true
}

export const renameLocale = (
  namespace: (typeof ALLOWED_NAMESPACE)[number],
  subnamespace: string,
  path: string,
  newName: string
): boolean => {
  for (const lang of ['en', 'ms', 'zh-CN', 'zh-TW']) {
    const filePath =
      namespace === 'apps'
        ? `${process.cwd()}/src/apps/${subnamespace}/locales/${lang}.json`
        : `${process.cwd()}/src/core/locales/${lang}/${namespace}/${subnamespace}.json`

    const data: Record<string, any> = JSON.parse(
      fs.readFileSync(filePath, 'utf-8')
    )

    const splitted: string[] = path.split('.')

    const key = splitted.pop()

    const target = splitted.reduce((acc, cur) => {
      if (!acc[cur]) {
        acc[cur] = {}
      }

      return acc[cur]
    }, data)

    if (target[key as string] === undefined) {
      throw new ClientError(`Key ${key} does not exist in path ${path}`)
    }

    if (target[newName] !== undefined) {
      throw new ClientError(
        `Key ${newName} already exists in path ${path}`,
        400
      )
    }

    target[newName] = target[key as string]
    delete target[key as string]

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  }

  return true
}

export const deleteLocale = (
  namespace: (typeof ALLOWED_NAMESPACE)[number],
  subnamespace: string,
  path: string
): boolean => {
  ;['en', 'ms', 'zh-CN', 'zh-TW'].forEach(lang => {
    const filePath =
      namespace === 'apps'
        ? `${process.cwd()}/src/apps/${subnamespace}/locales/${lang}.json`
        : `${process.cwd()}/src/core/locales/${lang}/${namespace}/${subnamespace}.json`

    const data: Record<string, any> = JSON.parse(
      fs.readFileSync(filePath, 'utf-8')
    )

    const splitted: string[] = path.split('.')

    const key = splitted.pop()

    const target = splitted.reduce((acc, cur) => {
      if (!acc[cur]) {
        acc[cur] = {}
      }

      return acc[cur]
    }, data)

    delete target[key as string]

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  })

  return true
}

export const getTranslationSuggestions = async (
  namespace: (typeof ALLOWED_NAMESPACE)[number],
  subnamespace: string,
  path: string,
  hint: string = '',
  pb: any
): Promise<Record<'en' | 'ms' | 'zh-CN' | 'zh-TW', string>> => {
  const LocaleSuggestions = z.object({
    en: z.string(),
    ms: z.string(),
    'zh-CN': z.string(),
    'zh-TW': z.string()
  })

  const prompt = `Translate i18n locale keys into natural language suitable for user interface elements such as buttons, labels, and descriptions. The input will be an array of two elements: the first is a locale key in the format {namespace}.{subnamespace}:{key}, and the second is an optional user-provided hint for reference.

        When translating, focus on {key}, but also consider {namespace} and {subnamespace} to understand the broader context. If the hint is appropriate, follow it to produce the translation without removing any words. If the hint is unclear, ambiguous, or inconsistent with the key’s context, use reasonable judgment based on the namespaces and key structure.

        Provide concise and clear translations in English (en), Bahasa Malaysia (ms), Simplified Chinese (zh-CN), and Traditional Chinese (zh-TW), ensuring they are user-friendly and contextually appropriate. Avoid overly technical language; adapt programming terms based on their role in the user interface.

        If the key remains ambiguous despite the hint and namespace context, seek clarification. If clarification is unavailable, provide a reasonable translation based on general UI patterns. For non-translatable texts, offer a functionally equivalent alternative that aligns with the UI’s purpose. Preserve the meaning of general text while ensuring it reads naturally.`

  const suggestions = await fetchAI({
    pb,
    model: 'gpt-4o-mini',
    provider: 'openai',
    messages: [
      {
        role: 'system',
        content: prompt
      },
      {
        role: 'user',
        content: JSON.stringify([`${namespace}.${subnamespace}:${path}`, hint])
      }
    ],
    structure: LocaleSuggestions
  })

  if (!suggestions) {
    throw new Error('Failed to generate suggestions')
  }

  return suggestions
}
