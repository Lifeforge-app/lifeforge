import { Icon } from '@iconify/react/dist/iconify.js'
import { Link } from 'react-router-dom'

function Header({
  sidebarOpen,
  setSidebarOpen
}: {
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
}) {
  return (
    <header className="bg-bg-900 border-bg-800 sticky top-0 z-[55] flex w-full items-center gap-8 border-b-[1.5px] p-3 px-5">
      <Link to="/" className="flex items-center gap-2">
        <Icon icon="tabler:hammer" className="text-custom-500 h-8 w-8" />
        <h1 className="hidden text-2xl font-semibold [@media(min-width:420px)]:block">
          LifeForge
          <span className="text-custom-500 ml-1 text-2xl">.</span>
          <span className="ml-1 text-xl font-medium">Docs</span>
        </h1>
        <span className="ml-1 text-xl font-medium [@media(min-width:420px)]:hidden">
          Docs.
        </span>
      </Link>
      <div className="flex w-full items-center justify-end gap-2">
        <search className="bg-bg-800/50 mr-2 hidden w-80 items-center gap-2 rounded-lg p-2 pl-4 md:flex lg:w-96">
          <div className="flex w-full items-center gap-2">
            <Icon icon="tabler:search" className="text-bg-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search documentation..."
              className="placeholder-bg-400 w-full bg-transparent p-1 focus:outline-none"
            />
          </div>
          <div className="text-bg-400 bg-bg-800/90 flex items-center rounded-md p-1 px-1.5">
            <Icon icon="tabler:command" className="h-4 w-4" />
            <span className="text-bg-400 ml-0.5 text-sm">K</span>
          </div>
        </search>
        <button className="p-2">
          <Icon icon="uil:moon" className="text-bg-400 h-6 w-6" />
        </button>
        <a
          href="https://github.com/melvinchia3636/lifeforge-documentation"
          target="_blank"
          rel="noreferrer"
          className="block p-2"
        >
          <Icon icon="uil:github" className="text-bg-400 h-6 w-6" />
        </a>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="block p-2 xl:hidden"
        >
          <Icon icon="tabler:menu" className="text-bg-400 h-6 w-6" />
        </button>
      </div>
    </header>
  )
}

export default Header
