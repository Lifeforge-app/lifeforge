import { Icon } from '@iconify/react/dist/iconify.js'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Button,
  DashboardItem,
  EmptyStateScreen,
  ListboxOrComboboxInput,
  ListboxOrComboboxOption
} from '@lifeforge/ui'

import forceDown from '@utils/forceDown'

interface CaptionData {
  captions: Record<string, CaptionMeta[]>
  auto_captions: Record<string, CaptionMeta[]>
  title: string
}

interface CaptionMeta {
  ext: string
  url: string
  name: string
}

interface CaptionSelectorProps {
  videoInfo: CaptionData
  summarizeLoading: boolean
  onSummarize: (url: string) => void
}

function CaptionSelector({
  videoInfo,
  summarizeLoading,
  onSummarize
}: CaptionSelectorProps) {
  const { t } = useTranslation('apps.youtubeSummarizer')
  const [captionType, setCaptionType] = useState<'auto' | 'manual' | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)

  useEffect(() => {
    setSelectedLanguage(null)
  }, [captionType])

  function handleSummarize() {
    if (!selectedLanguage) return

    const parsedSelection = JSON.parse(selectedLanguage)
    const vttUrl = parsedSelection.meta.find(
      (m: CaptionMeta) => m.ext === 'srv1'
    )?.url

    if (vttUrl) {
      onSummarize(vttUrl)
    }
  }

  function handleDownloadCaptions() {
    if (!selectedLanguage) return

    const parsedSelection = JSON.parse(selectedLanguage)
    const vtt = parsedSelection.meta.find((m: CaptionMeta) => m.ext === 'srv1')

    if (vtt) {
      forceDown(vtt.url, `${videoInfo.title}.srv1`)
    }
  }

  if (
    JSON.stringify(videoInfo.captions) === '{}' &&
    JSON.stringify(videoInfo.auto_captions) === '{}'
  ) {
    return (
      <DashboardItem
        className="mt-6 h-min"
        icon="tabler:text-caption"
        namespace="apps.youtubeSummarizer"
        title="Select Language"
      >
        <EmptyStateScreen
          smaller
          description={t('empty.captions.description', {
            type: t(`captionTypes.any`)
          })}
          icon="tabler:language-off"
          name={false}
          namespace={false}
          title={t('empty.captions.title')}
        />
      </DashboardItem>
    )
  }

  return (
    <DashboardItem
      className="mt-6 h-min"
      icon="tabler:text-caption"
      namespace="apps.youtubeSummarizer"
      title="Select Language"
    >
      <ListboxOrComboboxInput
        buttonContent={
          <>
            {captionType ? (
              <>
                <Icon
                  icon={
                    captionType === 'auto'
                      ? 'tabler:robot'
                      : 'tabler:message-language'
                  }
                />
                <span>
                  {captionType === 'auto'
                    ? t('captionTypes.auto')
                    : t('captionTypes.manual')}
                </span>
              </>
            ) : (
              <span className="text-bg-500">Select Language</span>
            )}
          </>
        }
        disabled={summarizeLoading}
        icon="tabler:text-grammar"
        name="Caption Type"
        namespace="apps.youtubeSummarizer"
        setValue={setCaptionType}
        type="listbox"
        value={captionType}
      >
        <ListboxOrComboboxOption
          icon="tabler:robot"
          text={t('captionTypes.auto')}
          value="auto"
        />
        <ListboxOrComboboxOption
          icon="tabler:message-language"
          text={t('captionTypes.manual')}
          value="manual"
        />
      </ListboxOrComboboxInput>
      {captionType &&
        (Object.keys(
          {
            auto: videoInfo.auto_captions,
            manual: videoInfo.captions
          }[captionType]
        ).length > 0 ? (
          <>
            <ListboxOrComboboxInput
              buttonContent={
                <>
                  <Icon icon="tabler:language" />
                  <span>
                    {selectedLanguage
                      ? JSON.parse(selectedLanguage).meta[0].name
                      : ''}
                  </span>
                </>
              }
              disabled={summarizeLoading}
              icon="tabler:language"
              name="Language"
              namespace="apps.youtubeSummarizer"
              setValue={setSelectedLanguage}
              type="listbox"
              value={selectedLanguage}
            >
              {Object.entries(
                captionType === 'auto'
                  ? videoInfo.auto_captions
                  : videoInfo.captions
              )
                .filter(([, meta]) => meta[0].name)
                .map(([language, meta]) => (
                  <ListboxOrComboboxOption
                    key={language}
                    icon="tabler:language"
                    text={meta[0].name ?? ''}
                    value={JSON.stringify({ language, meta })}
                  />
                ))}
            </ListboxOrComboboxInput>
            {selectedLanguage && (
              <>
                <Button
                  className="mt-6"
                  icon="tabler:download"
                  namespace="apps.youtubeSummarizer"
                  variant="secondary"
                  onClick={handleDownloadCaptions}
                >
                  Download Captions
                </Button>
                <Button
                  icon="mage:stars-c"
                  loading={summarizeLoading}
                  namespace="apps.youtubeSummarizer"
                  onClick={handleSummarize}
                >
                  Summarize This Video
                </Button>
              </>
            )}
          </>
        ) : (
          <div className="mt-4">
            <EmptyStateScreen
              smaller
              description={t('empty.captions.description', {
                type: t(`captionTypes.${captionType}`)
              })}
              icon="tabler:language-off"
              name={false}
              namespace={false}
              title={t('empty.captions.title')}
            />
          </div>
        ))}
    </DashboardItem>
  )
}

export default CaptionSelector
