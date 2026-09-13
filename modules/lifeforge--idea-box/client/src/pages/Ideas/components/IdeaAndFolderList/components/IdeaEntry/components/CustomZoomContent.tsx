function CustomZoomContent({
  img
}: {
  buttonUnzoom: React.ReactNode
  modalState: 'LOADING' | 'LOADED' | 'UNLOADING' | 'UNLOADED'
  img: any
}) {
  return <>{img}</>
}

export default CustomZoomContent
