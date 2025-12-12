import Scrollbars, { type ScrollbarsProps } from './Scrollbars'

/**
 * A wrapper around the `react-custom-scrollbars` component that provides custom styling and optional right padding.
 * The scrollbar library is unmaintained, so the library is cloned and fixed internally in our monorepo.
 */
function Scrollbar({
  children,
  ...props
}: { children: React.ReactNode } & ScrollbarsProps) {
  return (
    <Scrollbars
      {...props}
      hideTracksWhenNotNeeded
      autoHide={props.autoHide !== undefined ? props.autoHide : true}
      autoHideTimeout={1000}
      renderThumbVertical={props => (
        <div
          {...props}
          className="bg-bg-400 dark:bg-bg-700 rounded-lg"
          style={{ ...props.style, minHeight: 30 }}
        />
      )}
      renderTrackVertical={props => (
        <div
          {...props}
          className="bg-bg-200 dark:bg-bg-800/50"
          style={{ ...props.style, display: 'block' }}
        />
      )}
      renderView={props => (
        <div
          {...props}
          className="flex min-h-0 w-full min-w-0 flex-1 flex-col"
        />
      )}
    >
      {children}
    </Scrollbars>
  )
}

export default Scrollbar
