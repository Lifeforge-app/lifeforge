import { Icon } from '@iconify/react'
import { useUserPersonalization } from '@providers/UserPersonalizationProvider'
import type { UseQueryResult } from '@tanstack/react-query'
import type forgeAPI from '@utils/forgeAPI'
import { Listbox, ListboxOption, Tooltip } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import type { InferOutput } from 'shared'
import { usePersonalization } from 'shared'

function FontFamilyList({
  fontsQuery
}: {
  fontsQuery: UseQueryResult<
    InferOutput<typeof forgeAPI.user.personalization.listGoogleFonts>
  >
}) {
  const { t } = useTranslation('core.personalization')

  const { changeFontFamily } = useUserPersonalization()

  const { fontFamily } = usePersonalization()

  if (fontsQuery.isLoading) {
    return <Icon className="text-bg-500 size-6" icon="svg-spinners:180-ring" />
  }

  if (fontsQuery.isSuccess && fontsQuery.data.enabled) {
    return (
      <Listbox
        buttonContent={
          <span
            className="-mt-px block truncate"
            style={{
              fontFamily: `"${fontFamily}", sans-serif`
            }}
          >
            {fontFamily || (
              <span className="text-bg-500">
                {t('fontFamily.pleaseSelect')}
              </span>
            )}
          </span>
        }
        className="min-w-64"
        setValue={font => {
          changeFontFamily(font)
        }}
        value={fontFamily}
      >
        {fontsQuery.data.items.map(({ family }) => (
          <ListboxOption
            key={family}
            style={{
              fontFamily: `"${family}", sans-serif`
            }}
            text={family}
            value={family}
          />
        ))}
      </Listbox>
    )
  }

  return (
    <p className="text-bg-500 flex items-center gap-2">
      {t('fontFamily.disabled.title')}
      <Tooltip
        icon="tabler:info-circle"
        id="fontFamilyDisabled"
        tooltipProps={{
          clickable: true
        }}
      >
        <p className="text-bg-500 max-w-84">
          {t('fontFamily.disabled.tooltip')}{' '}
          <a
            className="text-custom-500 decoration-custom-500 font-medium underline decoration-2"
            href="https://docs.lifeforge.melvinchia.dev/user-guide/personalization#font-family"
            rel="noopener noreferrer"
            target="_blank"
          >
            Customization Guide
          </a>
        </p>
      </Tooltip>
    </p>
  )
}

export default FontFamilyList
