function CustomZoomContent({
  img
}: {
  buttonUnzoom: React.ReactNode
  modalState: 'LOADING' | 'LOADED' | 'UNLOADING' | 'UNLOADED'
  img: any
}): React.ReactElement {
  return <>{img}</>
}

export default CustomZoomContent
