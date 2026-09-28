import { memo } from 'react'

import { Bordered, Box, Grid, Text } from '@/components/primitives'

import type { IIconSet } from '../../../typescript/icon_selector_interfaces'
import { IconSetEntry } from './IconSetEntry'

function _CategoryEntry({
  category,
  iconSets,
  setCurrentIconSet
}: {
  category: string
  iconSets: IIconSet[]
  setCurrentIconSet: React.Dispatch<
    React.SetStateAction<{
      iconSet?: string
      search?: string
    } | null>
  >
}) {
  return (
    <Box as="section" mb="lg" minWidth="0" width="100%">
      <Box as="header" mb="xl" minWidth="0" position="relative" r="lg">
        <Text align="center" as="h2" size="3xl" weight="semibold">
          {category}
          <Bordered
            borderColor="primary"
            borderSide="bottom"
            borderWidth="4px"
            bottom="-0.5rem"
            left="50%"
            position="absolute"
            style={{
              left: '50%',
              transform: 'translateX(-50%)'
            }}
            width="2rem"
          />
        </Text>
      </Box>
      <Grid
        gap="sm"
        minWidth="0"
        templateCols={{
          base: '1',
          sm: 'repeat(auto-fill, minmax(320px, 1fr))'
        }}
      >
        {iconSets.map(iconSet => (
          <IconSetEntry
            key={iconSet.prefix}
            iconSet={iconSet}
            setCurrentIconSet={setCurrentIconSet}
          />
        ))}
      </Grid>
    </Box>
  )
}

export const CategoryEntry = memo(_CategoryEntry)
