import { Icon } from '@iconify/react/dist/iconify.js'
import { Link } from 'react-router-dom'

function CustomLink({ text, to }: { text: string; to: string }) {
  return (
    <Link
      to={to}
      className="text-custom-500 mt-6 flex items-center gap-2 text-lg font-medium hover:underline"
    >
      {text}
      <Icon icon="tabler:arrow-right" className="-mb-1 h-5 w-5" />
    </Link>
  )
}

export default CustomLink
