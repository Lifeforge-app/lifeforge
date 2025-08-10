import { addFontsToStylesheet } from '@core/pages/Personalization/utils/fontFamily'
import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { EmptyStateScreen, ModalHeader, QueryWrapper } from 'lifeforge-ui'
import { useEffect } from 'react'

function FontFamilySelectorModal({ onClose }: { onClose: () => void }) {
  const fontsQuery = useQuery(
    forgeAPI.user.personalization.listGoogleFonts.queryOptions()
  )

  useEffect(() => {
    if (fontsQuery.data) {
      addFontsToStylesheet(fontsQuery.data.items)
    }
  }, [fontsQuery.isSuccess])

  return (
    <div className="min-w-[40vw]">
      <ModalHeader
        icon="tabler:text-size"
        namespace="core.personalization"
        title="fontFamily.modals.fontFamilySelector"
        onClose={onClose}
      />
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
            <>{console.log(data.items)}</>
          )
        }
      </QueryWrapper>
    </div>
  )
}

export default FontFamilySelectorModal
