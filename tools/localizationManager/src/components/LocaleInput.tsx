import { TextInput } from 'lifeforge-ui'
import _ from 'lodash'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const LANG_FLAG = {
  en: 'uk',
  ms: 'my',
  'zh-CN': 'cn',
  'zh-TW': 'tw'
}

function LocaleInput({
  name,
  path,
  value,
  onChange,
  setChangedKeys,
  oldLocales
}: {
  name: string
  path: string[]
  value: string
  onChange: (key: string, path: string[], value: string) => void
  setChangedKeys: React.Dispatch<React.SetStateAction<string[]>>
  oldLocales: Record<string, any> | 'loading' | 'error'
}): React.ReactElement {
  const originalValue = useMemo(() => {
    if (typeof oldLocales === 'string') {
      return ''
    }

    return path.reduce((acc, key) => acc[key], oldLocales[name])
  }, [oldLocales, path, name])

  const { t } = useTranslation('apps.localizationManager')

  return (
    <TextInput
      className="w-full"
      icon={`circle-flags:${LANG_FLAG[name as keyof typeof LANG_FLAG]}`}
      label={t(`inputs.languages.${_.camelCase(name)}`)}
      placeholder={t(`inputs.translationPlaceholder`, {
        key: path.join('.')
      })}
      onChange={value => {
        onChange(name, path, value)

        const pathKey = path.join('.')

        if (value !== originalValue) {
          setChangedKeys(keys => {
            if (!keys.includes(pathKey)) {
              return [...keys, pathKey]
            }

            return keys
          })
        } else {
          setChangedKeys(keys => keys.filter(key => key !== pathKey))
        }
      }}
      value={value}
    />
  )
}

export default LocaleInput
