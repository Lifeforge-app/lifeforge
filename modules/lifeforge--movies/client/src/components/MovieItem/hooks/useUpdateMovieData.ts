import { useMutation, useQueryClient } from '@tanstack/react-query'

import { usePromiseLoading } from '@lifeforge/api'
import { toast } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

export function useUpdateMovieData(
  id: string
) {
  const queryClient = useQueryClient()

  const updateMovieDataMutation = useMutation(
    forgeAPI.entries.update.input({ id }).mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: forgeAPI.entries.key })
        toast.success('Movie data updated successfully.')
      },
      onError: () => {
        toast.error('Failed to update movie data.')
      }
    })
  )

  const [updateMovieDataLoading, handleUpdateMovieData] = usePromiseLoading(
    () => updateMovieDataMutation.mutateAsync(undefined)
  )

  return [updateMovieDataLoading, handleUpdateMovieData] as const
}
