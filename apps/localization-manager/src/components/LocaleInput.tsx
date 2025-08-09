import { Icon } from '@iconify/react/dist/iconify.js'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'

const LANG_FLAG = {
  en: 'uk',
  ms: 'my',
  'zh-CN': 'cn',
  'zh-TW': 'tw'
}

function LocaleInput({ name, value }: { name: string; value: string }) {
  const { t } = useTranslation('utils.localeAdmin')

  return (
    <div className="component-bg shadow-custom flex w-full items-center gap-4 rounded-md p-4">
      <Icon
        className="size-7"
        icon={`circle-flags:${LANG_FLAG[name as keyof typeof LANG_FLAG]}`}
      />
      <div>
        <p className="text-bg-500 text-sm font-medium">
          {t(`inputs.languages.${_.camelCase(name)}`)}
        </p>
        <p className="mt-1">{value}</p>
      </div>
    </div>
  )
}

export default LocaleInput
