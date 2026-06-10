import { useQuery } from '@tanstack/react-query'

import type { InferOutput } from '@lifeforge/api'
import { EmptyStateScreen, Flex, WithQuery } from '@lifeforge/ui'

import forgeAPI from '@/forgeAPI'

import GoogleFontFilter from './components/GoogleFontFilter'
import GoogleFontList from './components/GoogleFontList'
import { GoogleFontProvider, useGoogleFont } from './contexts/GoogleFontContext'

export type FontFamily = InferOutput<
  typeof forgeAPI.user.personalization.listGoogleFonts
>['items'][number]

function GoogleFontSelectorContent() {
  const apiKeyAvailable = useQuery(
    forgeAPI
      .checkAPIKeys({
        keys: 'gcloud'
      })
      .queryOptions()
  )
  
const { pinnedFontsQuery, fontsQuery } = useGoogleFont()

  return (
    <WithQuery query={apiKeyAvailable}>
      {apiKeyAvailable =>
        apiKeyAvailable ? (
          <WithQuery query={pinnedFontsQuery}>
            {pinnedFontsData => (
              <WithQuery query={fontsQuery}>
                {fonts => (
                  <>
                    <GoogleFontFilter />
                    <GoogleFontList
                      fontsEnabled={fonts.enabled}
                      pinnedFonts={pinnedFontsData}
                    />
                  </>
                )}
              </WithQuery>
            )}
          </WithQuery>
        ) : (
          <Flex centered flex="1">
            <EmptyStateScreen
              icon="tabler:key-off"
              message={{
                id: 'apiKey',
                namespace: 'common.personalization',
                tKey: 'fontFamily'
              }}
            />
          </Flex>
        )
      }
    </WithQuery>
  )
}

function GoogleFontSelector({
  selectedFont,
  setSelectedFont
}: {
  selectedFont: string | null
  setSelectedFont: (font: string | null) => void
}) {
  return (
    <GoogleFontProvider
      selectedFont={selectedFont}
      setSelectedFont={setSelectedFont}
    >
      <GoogleFontSelectorContent />
    </GoogleFontProvider>
  )
}

export default GoogleFontSelector
