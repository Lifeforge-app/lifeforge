import { useQuery } from '@tanstack/react-query'

import { EmptyStateScreen, Flex, WithQuery } from '@lifeforge/ui'

import forgeAPI from '@/core/utils/forgeAPI'

import GoogleFontFilter from './components/GoogleFontFilter'
import GoogleFontList from './components/GoogleFontList'
import { GoogleFontProvider, useGoogleFont } from './contexts/GoogleFontContext'

import type { InferOutput } from '@lifeforge/api'

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

function GoogleFontSelector() {
  return (
    <GoogleFontProvider>
      <GoogleFontSelectorContent />
    </GoogleFontProvider>
  )
}

export default GoogleFontSelector
