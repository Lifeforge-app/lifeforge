import Scrollbars, { type ScrollbarsProps } from './Scrollbars'

function Scrollbar({
  children,
  ...props
}: {
  children: React.ReactNode
} & ScrollbarsProps) {
  return (
    <Scrollbars
      {...(props as any)}
      autoHide
      hideTracksWhenNotNeeded
      autoHideTimeout={1000}
      renderThumbVertical={props => (
        <div
          {...props}
          className="bg-bg-300 dark:bg-bg-800 rounded-lg"
          style={{ ...props.style, minHeight: 30 }}
        />
      )}
      renderTrackVertical={props => (
        <div
          {...props}
          className="bg-bg-100 dark:bg-bg-900"
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
