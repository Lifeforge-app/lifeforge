/// <reference types="google.maps" />
import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { type InferOutput } from '@lifeforge/api'
import { TAILWIND_PALETTE } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import numberToCurrency from '@/utils/numberToCurrency'

export type SpendingLocationData = InferOutput<
  typeof forgeAPI.analytics.getSpendingByLocation
>[number]

export interface Cluster {
  lat: number
  lng: number
  amount: number
  count: number
  points: SpendingLocationData[]
}

export interface SpendingHeatmapPreferences {
  metric: 'amount' | 'count'
  showHeatmap: boolean
  showMarkers: boolean
}

function useSpendingHeatmapState() {
  const navigate = useNavigate()

  const [preferences, setPreferences] = useState<SpendingHeatmapPreferences>({
    metric: 'amount',
    showHeatmap: true,
    showMarkers: false
  })

  const [zoom, setZoom] = useState(8)
  const [center, setCenter] = useState<google.maps.LatLngLiteral | null>(null)

  const isZoomedIn = zoom >= 13
  const activeShowHeatmap = preferences.showHeatmap && !isZoomedIn
  const activeShowMarkers =
    preferences.showMarkers || (preferences.showHeatmap && isZoomedIn)

  const spendingDataQuery = useQuery(
    forgeAPI.analytics.getSpendingByLocation.queryOptions()
  )

  const googleMapAPIKeyQuery = useQuery(
    forgeAPI.getAPIKeys({ keyId: 'gcloud' }).queryOptions({ retry: false })
  )

  const spendingData = spendingDataQuery.data ?? []

  function getMarkerColor(amount: number) {
    if (amount <= 100) return TAILWIND_PALETTE.green[500]
    if (amount <= 500) return TAILWIND_PALETTE.yellow[500]
    if (amount <= 1000) return TAILWIND_PALETTE.orange[500]

    return TAILWIND_PALETTE.red[500]
  }

  function formatClusterText(cluster: Cluster) {
    if (preferences.metric === 'count') {
      return String(cluster.count)
    }

    const formatted = numberToCurrency(cluster.amount)

    return formatted.endsWith('.00') ? formatted.slice(0, -3) : formatted
  }

  function getClusterWidth(cluster: Cluster) {
    if (preferences.metric === 'count') return 36

    const textLength = formatClusterText(cluster).length

    return Math.max(36, textLength * 8 + 16)
  }

  const centerPoint = useMemo(() => {
    if (spendingData.length === 0) return { lat: 0, lng: 0 }

    const avgLat =
      spendingData.reduce(
        (sum, data: SpendingLocationData) => sum + data.lat,
        0
      ) / spendingData.length

    const avgLng =
      spendingData.reduce(
        (sum, data: SpendingLocationData) => sum + data.lng,
        0
      ) / spendingData.length

    return { lat: avgLat, lng: avgLng }
  }, [spendingData])

  useEffect(() => {
    if (spendingData.length > 0 && !center) {
      setCenter(centerPoint)
    }
  }, [spendingData, centerPoint, center])

  const clusters = useMemo(() => {
    const list: Cluster[] = []

    // Degrees threshold for clustering based on zoom level
    const threshold = 84.375 / Math.pow(2, zoom)

    for (const point of spendingData) {
      let added = false

      for (const cluster of list) {
        const dLat = point.lat - cluster.lat
        const dLng = point.lng - cluster.lng
        const distance = Math.sqrt(dLat * dLat + dLng * dLng)

        if (distance < threshold) {
          cluster.points.push(point)
          cluster.amount += point.amount
          cluster.count += point.count
          cluster.lat =
            cluster.points.reduce((sum, p) => sum + p.lat, 0) /
            cluster.points.length
          cluster.lng =
            cluster.points.reduce((sum, p) => sum + p.lng, 0) /
            cluster.points.length
          added = true
          break
        }
      }

      if (!added) {
        list.push({
          lat: point.lat,
          lng: point.lng,
          amount: point.amount,
          count: point.count,
          points: [point]
        })
      }
    }

    return list
  }, [spendingData, zoom])

  function handleClusterClick(cluster: Cluster) {
    if (cluster.points.length === 1) {
      navigate(
        `/wallet/transactions?q=${encodeURIComponent(
          cluster.points[0].locationName
        )}`
      )
    } else {
      setZoom(prev => Math.min(prev + 2, 20))
      setCenter({ lat: cluster.lat, lng: cluster.lng })
    }
  }

  return {
    preferences,
    setPreferences,
    zoom,
    setZoom,
    center,
    setCenter,
    isZoomedIn,
    activeShowHeatmap,
    activeShowMarkers,
    spendingData,
    spendingDataQuery,
    googleMapAPIKeyQuery,
    getMarkerColor,
    formatClusterText,
    getClusterWidth,
    centerPoint,
    clusters,
    handleClusterClick
  }
}

type SpendingHeatmapContextValue = ReturnType<typeof useSpendingHeatmapState>

const SpendingHeatmapContext =
  createContext<SpendingHeatmapContextValue | null>(null)

export function SpendingHeatmapProvider({
  children
}: {
  children: React.ReactNode
}) {
  const value = useSpendingHeatmapState()

  return (
    <SpendingHeatmapContext value={value}>{children}</SpendingHeatmapContext>
  )
}

export function useSpendingHeatmap() {
  const context = useContext(SpendingHeatmapContext)

  if (!context) {
    throw new Error(
      'useSpendingHeatmap must be used within a SpendingHeatmapProvider'
    )
  }

  return context
}
