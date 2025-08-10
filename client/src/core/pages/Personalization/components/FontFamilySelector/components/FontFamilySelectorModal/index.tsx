import { useUserPersonalization } from '@providers/UserPersonalizationProvider'
import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  Button,
  EmptyStateScreen,
  Listbox,
  ListboxOption,
  ModalHeader,
  QueryWrapper,
  Scrollbar
} from 'lifeforge-ui'
import _ from 'lodash'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { AutoSizer } from 'react-virtualized'
import { type InferOutput, usePersonalization } from 'shared'

import FontListItem from './components/FontListItem'

export type FontFamily = InferOutput<
  typeof forgeAPI.user.personalization.listGoogleFonts
>['items'][number]

function FontFamilySelectorModal({ onClose }: { onClose: () => void }) {
  const fontsQuery = useQuery(
    forgeAPI.user.personalization.listGoogleFonts.queryOptions()
  )

  const { fontFamily } = usePersonalization()

  const { changeFontFamily } = useUserPersonalization()

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const [selectedFont, setSelectedFont] = useState<string | null>(fontFamily)

  const filteredFonts = useMemo(
    () =>
      fontsQuery.data?.items.filter(font => {
        if (!selectedCategory) return true

        return font.category === selectedCategory
      }),
    [fontsQuery.data, selectedCategory]
  )

  return (
    <div className="flex h-full min-h-[80vh] min-w-[40vw] flex-col">
      <ModalHeader
        icon="tabler:text-size"
        namespace="core.personalization"
        title="fontFamily.modals.fontFamilySelector"
        onClose={onClose}
      />
      <Listbox
        buttonContent={
          <span>
            {_.startCase(selectedCategory || '') || 'Select a category'}
          </span>
        }
        className="mb-4"
        setValue={setSelectedCategory}
        value={selectedCategory}
      >
        {[...new Set(fontsQuery.data?.items.map(font => font.category))].map(
          category => (
            <ListboxOption
              key={category}
              text={_.startCase(category)}
              value={category}
            />
          )
        )}
      </Listbox>
      <QueryWrapper query={fontsQuery}>
        {data =>
          !data.enabled ? (
            <EmptyStateScreen
              icon="tabler:key-off"
              name="apiKey"
              namespace="core.personalization"
              tKey="fontFamily"
            />
          ) : (
            <div className="h-full w-full flex-1">
              <AutoSizer>
                {({ height, width }) => (
                  <Scrollbar
                    style={{
                      height: `${height}px`,
                      width: `${width}px`
                    }}
                  >
                    <div className="w-full space-y-3">
                      {filteredFonts?.map(font => (
                        <FontListItem
                          key={font.family}
                          font={font}
                          selectedFont={selectedFont}
                          setSelectedFont={setSelectedFont}
                        />
                      ))}
                    </div>
                  </Scrollbar>
                )}
              </AutoSizer>
            </div>
          )
        }
      </QueryWrapper>
      {selectedFont && (
        <Button
          className="mt-6"
          icon="tabler:check"
          onClick={() => {
            changeFontFamily(selectedFont)
            onClose()
            toast.success('Font family changed successfully!')
          }}
        >
          Select
        </Button>
      )}
    </div>
  )
}

export default FontFamilySelectorModal
