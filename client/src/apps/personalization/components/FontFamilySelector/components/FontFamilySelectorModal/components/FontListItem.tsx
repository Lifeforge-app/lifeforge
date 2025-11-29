import forgeAPI from '@/utils/forgeAPI'
import { Icon } from '@iconify/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { Button } from 'lifeforge-ui'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { usePromiseLoading } from 'shared'

import type { FontFamily } from '..'
import {
  addFontToStylesheet,
  removeFontFromStylesheet
} from '../../../utils/fontFamily'

function FontListItem({
  font,
  selectedFont,
  isPinned,
  setSelectedFont
}: {
  font: FontFamily
  selectedFont: string | null
  isPinned: boolean
  setSelectedFont: (font: string) => void
}) {
  const queryClient = useQueryClient()

  const togglePinMutation = useMutation(
    forgeAPI.user.personalization.toggleGoogleFontsPin.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: forgeAPI.user.personalization.listGoogleFontsPin.key
        })
      },
      onError: () => {
        toast.error('Failed to toggle font pin')
      }
    })
  )

  const [loadingPin, handleTogglePin] = usePromiseLoading(async () => {
    await togglePinMutation.mutateAsync({ family: font.family })
  })

  useEffect(() => {
    addFontToStylesheet(font)

    return () => {
      removeFontFromStylesheet(font.family)
    }
  }, [font])

  return (
    <button
      className={clsx(
        'component-bg-lighter-with-hover relative w-full min-w-0 rounded-lg p-6 text-left',
        selectedFont === font.family && 'border-custom-500 border-2'
      )}
      onClick={() => setSelectedFont(font.family)}
    >
      <div className="flex w-full min-w-0 flex-col pr-6 text-lg font-medium md:flex-row md:items-center md:gap-2">
        <span className="min-w-0 truncate">{font.family}</span>
        <span className="text-bg-500 hidden text-base whitespace-nowrap md:block">
          ({font.variants.length} variants)
        </span>
        <span className="text-bg-500 block text-base whitespace-nowrap md:hidden">
          {font.variants.length} variants
        </span>
      </div>
      <Button
        className={clsx(
          'absolute top-2 right-2 p-1',
          isPinned && 'text-custom-500'
        )}
        icon={isPinned ? 'tabler:heart-filled' : 'tabler:heart'}
        loading={loadingPin}
        variant="plain"
        onClick={e => {
          e.stopPropagation()
          handleTogglePin()
        }}
      />
      {selectedFont === font.family && (
        <Icon
          className="text-custom-500 absolute right-1.5 bottom-2 size-6"
          icon="tabler:circle-check-filled"
        />
      )}
      <p
        className="relative mt-4 truncate overflow-hidden py-4 text-4xl"
        style={{
          fontFamily: font.family
        }}
      >
        The quick brown fox jumps over the lazy dog
      </p>
    </button>
  )
}

export default FontListItem
