import React from 'react'

function CustomZoomContent({
  img
}: {
  buttonUnzoom: React.ReactElement
  modalState: 'LOADING' | 'LOADED' | 'UNLOADING' | 'UNLOADED'
  img: any
}): React.ReactElement {
  return <>{img}</>
}

export default CustomZoomContent
