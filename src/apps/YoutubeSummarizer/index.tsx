/* eslint-disable sonarjs/no-nested-conditional */
import { Icon } from '@iconify/react/dist/iconify.js'
import { useDebounce } from '@uidotdev/usehooks'
import dayjs from 'dayjs'
import humanNumber from 'human-number'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Button,
  DashboardItem,
  EmptyStateScreen,
  ListboxOrComboboxInput,
  ListboxOrComboboxOption,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper,
  TextInput
} from '@lifeforge/ui'

import { IYoutubeVideoInfo } from '@apps/YoutubeVideos/interfaces/youtube_video_storage_interfaces'

import useAPIQuery from '@hooks/useAPIQuery'

function YoutubeSummarizer() {
  const { t } = useTranslation('apps.youtubeSummarizer')
  const [videoUrl, setVideoUrl] = useState<string>('')
  const debouncedVideoUrl = useDebounce(videoUrl, 500)
  const videoID = useMemo(() => {
    try {
      if (debouncedVideoUrl.includes('youtube.com/watch?v=')) {
        return new URL(debouncedVideoUrl).searchParams.get('v')
      } else if (debouncedVideoUrl.includes('youtu.be/')) {
        return debouncedVideoUrl.split('?')[0].split('/').pop()
      }
    } catch {
      return
    }
  }, [debouncedVideoUrl])
  const videoInfoQuery = useAPIQuery<
    IYoutubeVideoInfo & {
      captions: Record<
        string,
        {
          ext: string
          url: string
          name: string
        }[]
      >
      auto_captions: Record<
        string,
        {
          ext: string
          url: string
          name: string
        }[]
      >
    }
  >(
    `/youtube-summarizer/info/${videoID}`,
    ['youtube-summarizer', 'info', videoID],
    !!videoID && videoID.length === 11
  )
  const [captionType, setCaptionType] = useState<'auto' | 'manual' | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)

  useEffect(() => {
    setSelectedLanguage(null)
  }, [captionType])

  return (
    <ModuleWrapper>
      <ModuleHeader icon="tabler:brand-youtube" title="Youtube Summarizer" />
      <TextInput
        className="mt-6"
        icon="tabler:link"
        name="video URL"
        namespace="apps.youtubeSummarizer"
        placeholder="https://www.youtube.com/watch?v=..."
        setValue={setVideoUrl}
        value={videoUrl}
      />
      {videoID?.length !== 11 ? (
        <EmptyStateScreen
          icon="tabler:link-off"
          name="videoURL"
          namespace="apps.youtubeSummarizer"
        />
      ) : (
        <div className="my-6">
          <QueryWrapper query={videoInfoQuery}>
            {videoInfo =>
              videoInfo ? (
                <>
                  <DashboardItem
                    className="h-min"
                    icon="tabler:info-circle"
                    namespace="apps.youtubeSummarizer"
                    title="Video Info"
                  >
                    <div className="flex md:items-center md:flex-row flex-col gap-6">
                      <div className="md:w-64 w-full border-bg-800 relative shrink-0 overflow-hidden rounded-md border">
                        <img
                          alt=""
                          className="size-full object-cover"
                          src={videoInfo.thumbnail}
                        />
                        <p className="bg-bg-900/70 text-bg-50 absolute bottom-2 right-2 rounded-md px-1.5 py-0.5">
                          {dayjs
                            .duration(+videoInfo.duration, 'second')
                            .format(
                              +videoInfo.duration > 3600 ? 'h:mm:ss' : 'm:ss'
                            )}
                        </p>
                      </div>
                      <div>
                        <h2 className="line-clamp-2 text-2xl font-medium">
                          {videoInfo.title}
                        </h2>
                        <p className="text-custom-500 mt-1">
                          {videoInfo.uploader}
                        </p>
                        {videoInfo.uploadDate !== undefined && (
                          <p className="text-bg-500 mt-4">
                            {humanNumber(+videoInfo.viewCount)} views •{' '}
                            {dayjs(videoInfo.uploadDate, 'YYYYMMDD').fromNow()}
                          </p>
                        )}
                        {videoInfo.likeCount !== undefined && (
                          <p className="text-bg-500 mt-1 flex items-center gap-1">
                            <Icon icon="uil:thumbs-up" />{' '}
                            {humanNumber(+videoInfo.likeCount)} likes
                          </p>
                        )}
                      </div>
                    </div>
                  </DashboardItem>
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
                        captionType === 'auto'
                          ? videoInfo.auto_captions
                          : videoInfo.captions
                      ).length > 0 ? (
                        <>
                          <ListboxOrComboboxInput
                            buttonContent={
                              <>
                                <Icon icon="tabler:language" />
                                <span>
                                  {selectedLanguage
                                    ? videoInfo[
                                        captionType === 'auto'
                                          ? 'auto_captions'
                                          : 'captions'
                                      ][selectedLanguage][0].name
                                    : ''}
                                </span>
                              </>
                            }
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
                            ).map(([language, meta]) => (
                              <ListboxOrComboboxOption
                                key={language}
                                icon="tabler:language"
                                text={meta[0].name}
                                value={language}
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
                              >
                                Download Captions
                              </Button>
                              <Button
                                icon="mage:stars-c"
                                namespace="apps.youtubeSummarizer"
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
                </>
              ) : (
                <EmptyStateScreen
                  icon="tabler:link-off"
                  name="videoURL"
                  namespace="apps.youtubeSummarizer"
                />
              )
            }
          </QueryWrapper>
        </div>
      )}
    </ModuleWrapper>
  )
}

export default YoutubeSummarizer
