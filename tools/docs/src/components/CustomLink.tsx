import { Icon } from '@iconify/react'
import { Link } from 'react-router'

function CustomLink({ text, to }: { text: string; to: string }) {
  return (
    <Link
      className="text-custom-500 mt-4 flex items-center gap-2 text-lg font-medium hover:underline"
      to={to}
    >
      {text}
      <Icon className="-mb-1 h-5 w-5" icon="tabler:arrow-right" />
    </Link>
  )
}

export default CustomLink
