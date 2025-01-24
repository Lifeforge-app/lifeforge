/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import React from 'react'
import { type ScrollbarProps, Scrollbars } from 'react-custom-scrollbars'

function Scrollbar({
  children,
  ...props
}: {
  children: React.ReactNode
} & ScrollbarProps): React.ReactElement {
  return (
    <Scrollbars
      {...props}
      renderView={props => (
        <div {...props} className="flex min-h-0 flex-1 flex-col" />
      )}
      renderThumbVertical={props => (
        <div {...props} className="rounded-lg bg-bg-300 dark:bg-bg-800" />
      )}
      autoHide
      autoHideDuration={200}
    >
      {children}
    </Scrollbars>
  )
}

export default Scrollbar
