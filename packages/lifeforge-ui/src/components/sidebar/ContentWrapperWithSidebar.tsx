function ContentWrapperWithSidebar({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative z-0 flex h-full min-w-0 flex-1 flex-col">
      {children}
    </div>
  )
}

export default ContentWrapperWithSidebar
