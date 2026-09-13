import { createContext, useContext } from 'react'

import type { InferOutput } from '@lifeforge/api'

import { forgeAPI } from '@/manifest'

interface MovieItemContextValue {
  data: InferOutput<typeof forgeAPI.entries.list>['entries'][number]
  type: 'grid' | 'list'
}

const MovieItemContext = createContext<MovieItemContextValue | null>(null)

export default function MovieItemProvider({
  data,
  type,
  children
}: MovieItemContextValue & { children: React.ReactNode }) {
  return <MovieItemContext value={{ data, type }}>{children}</MovieItemContext>
}

export function useMovieItemContext() {
  const ctx = useContext(MovieItemContext)

  if (!ctx) {
    throw new Error('useMovieItemContext must be used within MovieItemProvider')
  }

  return ctx
}
