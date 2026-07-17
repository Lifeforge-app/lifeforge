import { useQuery } from '@tanstack/react-query'
import { AutoSizer } from 'react-virtualized'

import {
  Button,
  EmptyStateScreen,
  Flex,
  Scrollbar,
  Stack,
  WithQuery,
  useModalStore
} from '@lifeforge/ui'

import forgeAPI from '@/core/utils/forgeAPI'

import CustomFontCard from './components/CustomFontCard'
import CustomFontUploadModal from './components/CustomFontUploadModal'

export type CustomFont = {
  id: string
  displayName: string
  family: string
  weight: number
  file: string
  collectionId: string
}

function CustomFontSelector() {
  const { open } = useModalStore()

  const customFontsQuery = useQuery(
    forgeAPI.user.customFonts.list.queryOptions()
  )

  const handleUploadClick = () => {
    open(CustomFontUploadModal, {
      openType: 'create'
    })
  }

  return (
    <Stack flex="1" minHeight="0">
      <Button
        icon="tabler:upload"
        mb="sm"
        namespace="common.personalization"
        width="100%"
        onClick={handleUploadClick}
      >
        fontFamily.buttons.uploadButton
      </Button>
      <WithQuery query={customFontsQuery}>
        {fonts =>
          fonts.length > 0 ? (
            <Flex direction="column" flex="1">
              <AutoSizer>
                {({ width, height }) => (
                  <Scrollbar
                    style={{
                      height: `${height}px`,
                      width: `${width}px`
                    }}
                  >
                    <Stack p="sm">
                      {fonts.map(font => (
                        <CustomFontCard key={font.id} font={font} />
                      ))}
                    </Stack>
                  </Scrollbar>
                )}
              </AutoSizer>
            </Flex>
          ) : (
            <Flex centered flex="1">
              <EmptyStateScreen
                icon="tabler:file-typography"
                message={{
                  id: 'customFont',
                  namespace: 'common.personalization',
                  tKey: 'fontFamily'
                }}
              />
            </Flex>
          )
        }
      </WithQuery>
    </Stack>
  )
}

export default CustomFontSelector
