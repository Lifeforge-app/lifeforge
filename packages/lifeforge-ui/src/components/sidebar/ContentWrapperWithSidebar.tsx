function ContentWrapperWithSidebar({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative z-[9990] flex h-full flex-1 flex-col">
      {children}
    </div>
  )
}

export default ContentWrapperWithSidebar
