import { Icon } from '@iconify/react'
import React from 'react'
import { Link } from 'react-router-dom'

function NotFound(): React.ReactElement {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <h1 className="text-[10rem] text-custom-500">;-;</h1>
      <h1 className="text-4xl font-semibold">Page not found</h1>
      <h2 className="-mt-2 text-xl text-bg-500">
        The page you are looking for does not exist.
      </h2>
      <div className="mt-6 flex items-center gap-4">
        <Link
          to="/"
          className="flex items-center rounded-lg bg-custom-500 px-6 py-4 font-medium uppercase tracking-widest text-white shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] hover:bg-custom-600"
        >
          <Icon icon="tabler:arrow-left" className="mr-2 h-5 w-5" />
          Return home
        </Link>
        <Link
          to="bug-report"
          className="flex items-center rounded-lg bg-bg-200 px-6 py-4 font-medium uppercase tracking-widest shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] hover:bg-bg-300 dark:bg-bg-800"
        >
          <Icon icon="tabler:bug" className="mr-2 h-5 w-5" />
          Report a bug
        </Link>
      </div>
    </div>
  )
}

export default NotFound
