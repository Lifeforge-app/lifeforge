import { Button } from '@components/inputs'

function SidebarCollapseButton({
  onClick,
  isCollapsed
}: {
  onClick: () => void
  isCollapsed: boolean
}) {
  return (
    <Button
      icon="tabler:chevron-down"
      iconStyle={{
        transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.3s'
      }}
      style={{
        padding: '0.5em'
      }}
      variant="plain"
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }}
    />
  )
}

export default SidebarCollapseButton
