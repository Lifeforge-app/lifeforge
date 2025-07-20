import { Icon } from '@iconify/react/dist/iconify.js'

function NodeConfigButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="component-bg-with-hover text-bg-400 dark:text-bg-700 absolute top-2 right-2 rounded-md p-2"
      onClick={onClick}
    >
      <Icon icon="tabler:settings" className="size-4" />
    </button>
  )
}

export default NodeConfigButton
