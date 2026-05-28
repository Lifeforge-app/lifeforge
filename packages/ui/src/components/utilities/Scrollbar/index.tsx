import { Box, Flex } from '@/components/primitives'

import { Scrollbars, type ScrollbarsProps } from '../Scrollbars'

/**
 * A wrapper around the `react-custom-scrollbars` component that provides custom styling and optional right padding.
 * The scrollbar library is unmaintained, so the library is cloned and fixed internally in our monorepo.
 */
export function Scrollbar({
  children,
  ...props
}: { children: React.ReactNode; usePaddingRight?: boolean } & ScrollbarsProps) {
  return (
    <Scrollbars
      {...props}
      hideTracksWhenNotNeeded
      autoHide={props.autoHide !== undefined ? props.autoHide : true}
      autoHideTimeout={1000}
      renderThumbVertical={props => (
        <Box
          {...props}
          bg={{ base: 'bg-400', dark: 'bg-600' }}
          minHeight="30px"
          rounded="lg"
          style={{ ...props.style }}
        />
      )}
      renderTrackVertical={props => (
        <Box
          {...props}
          bg={{ base: 'bg-200', dark: 'bg-800' }}
          style={{ ...props.style, display: 'block' }}
        />
      )}
      renderView={p => (
        <Flex
          {...p}
          direction="column"
          flex="1"
          minHeight="0"
          minWidth="0"
          style={{ ...p.style }}
          width="100%"
        />
      )}
    >
      {children}
    </Scrollbars>
  )
}
