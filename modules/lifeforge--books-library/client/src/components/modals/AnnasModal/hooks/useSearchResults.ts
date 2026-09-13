import { useState } from 'react'

import { usePromiseLoading } from '@lifeforge/api'
import { toast } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { AnnasSearchResult } from '..'

export function useSearchResults() {
  const [searchQuery, setSearchQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState<AnnasSearchResult | null>(null)

  async function fetchBookResults(page: number = 1) {
    if (searchQuery.trim() === '') {
      toast.error('Please enter a search query')

      return
    }

    setHasSearched(true)

    try {
      const response = await forgeAPI.annas.search
        .input({
          q: searchQuery.trim(),
          page: page.toString()
        })
        .query()

      if (response.success) {
        setData(response.results.length === 0 ? null : response)
        setCurrentPage(response.currentPage || page)
      } else {
        toast.error(response.error || 'Failed to fetch search results')
        setData(null)
      }
    } catch (error) {
      toast.error('Failed to fetch search results')
      setData(null)
      console.error("Anna's Archive search error:", error)
    }
  }

  const [loading, triggerFetch] = usePromiseLoading(fetchBookResults)

  function handleSearch() {
    setCurrentPage(1)
    triggerFetch(1)
  }

  return {
    searchQuery,
    setSearchQuery,
    hasSearched,
    setHasSearched,
    currentPage,
    data,
    loading,
    handleSearch
  }
}
