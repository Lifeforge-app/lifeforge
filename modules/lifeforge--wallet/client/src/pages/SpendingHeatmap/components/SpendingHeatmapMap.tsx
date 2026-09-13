/// <reference types="google.maps" />
import { APIProvider, AdvancedMarker, Map } from '@vis.gl/react-google-maps'

import { Box, Flex, Text, usePersonalization } from '@lifeforge/ui'

import numberToCurrency from '@/utils/numberToCurrency'

import {
  type Cluster,
  useSpendingHeatmap
} from '../providers/SpendingHeatmapProvider'
import { HeatmapLayer } from './HeatmapLayer'

function SpendingHeatmapMap({ googleMapAPIKey }: { googleMapAPIKey: string }) {
  const { derivedTheme } = usePersonalization()

  const {
    center,
    centerPoint,
    zoom,
    setZoom,
    setCenter,
    activeShowHeatmap,
    activeShowMarkers,
    spendingData,
    preferences,
    clusters,
    getMarkerColor,
    getClusterWidth,
    formatClusterText,
    handleClusterClick
  } = useSpendingHeatmap()

  return (
    <APIProvider apiKey={googleMapAPIKey}>
      <Box
        flex="1"
        height="100%"
        position="relative"
        style={{
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden'
        }}
        width="100%"
      >
        <Map
          center={center || centerPoint}
          colorScheme={derivedTheme === 'dark' ? 'DARK' : 'LIGHT'}
          mapId="SpendingHeatmap"
          style={{
            width: '100%',
            height: '100%'
          }}
          zoom={zoom}
          onCameraChanged={ev => {
            setZoom(ev.detail.zoom)
            setCenter(ev.detail.center)
          }}
        >
          {activeShowHeatmap && (
            <HeatmapLayer data={spendingData} metric={preferences.metric} />
          )}
          {activeShowMarkers &&
            clusters.map(function (cluster: Cluster, index: number) {
              return (
                <AdvancedMarker
                  key={index}
                  position={{
                    lat: cluster.lat,
                    lng: cluster.lng
                  }}
                  onClick={() => handleClusterClick(cluster)}
                >
                  <Flex
                    centered
                    align="center"
                    height="2.25rem"
                    position="relative"
                    px="sm"
                    r="full"
                    style={{
                      backgroundColor: getMarkerColor(cluster.amount),
                      border: '2px solid white',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      fontFamily:
                        typeof document !== 'undefined'
                          ? getComputedStyle(document.body).fontFamily
                          : 'inherit'
                    }}
                    title={
                      cluster.points.length === 1
                        ? `${cluster.points[0].locationName}: ${numberToCurrency(cluster.amount)}`
                        : `${cluster.points.length} locations: ${numberToCurrency(cluster.amount)}`
                    }
                    width={`${getClusterWidth(cluster)}px`}
                  >
                    <Text align="center" color="bg-100" size="sm" weight="bold">
                      {formatClusterText(cluster)}
                    </Text>
                  </Flex>
                </AdvancedMarker>
              )
            })}
        </Map>
      </Box>
    </APIProvider>
  )
}

export default SpendingHeatmapMap
