import { Scrollbars } from 'react-custom-scrollbars'
import { Link, useLocation } from 'react-router-dom'

import SECTIONS from '../constants/Sections'
import { toLinkCase } from '../utils/string'

function Sidebar({
  sidebarOpen,
  setSidebarOpen
}: {
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
}) {
  const location = useLocation()

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-screen w-full transition-all ${
          sidebarOpen
            ? 'z-40 bg-black/20 backdrop-blur-md'
            : 'z-[-1] bg-transparent filter-none'
        }`}
      ></div>
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'
        } bg-bg-100 dark:bg-bg-900 fixed left-0 z-50 h-[calc(100%-2rem)] w-full flex-1 overflow-y-auto transition-all sm:w-3/4 md:w-1/2 xl:w-80`}
      >
        <Scrollbars
          autoHide
          autoHideDuration={200}
          autoHideTimeout={1000}
          renderThumbVertical={({ style, ...props }) => (
            <div
              {...props}
              className="bg-bg-800 rounded-md"
              style={{
                ...style
              }}
            />
          )}
        >
          <div className="space-y-6 p-12">
            {Object.entries(SECTIONS).map(([title, items]) => (
              <div key={title}>
                <h2 className="text-lg font-semibold">{title}</h2>
                <div className="before:border-bg-200 dark:before:border-bg-800 relative isolate mt-4 before:absolute before:top-0 before:left-0 before:z-[-1] before:h-full before:border-r-[1.5px]">
                  {items.map(item => (
                    <Link
                      key={`${title}-${item}`}
                      className={`block cursor-pointer px-4 py-2 transition-all ${
                        location.pathname ===
                        `/${toLinkCase(title)}/${toLinkCase(item)}`
                          ? 'text-custom-500 border-custom-500 hover:border-custom-500 border-l-[2.5px] font-semibold'
                          : 'text-bg-600 dark:text-bg-400 hover:text-bg-800 dark:hover:text-bg-100 hover:font-medium'
                      }`}
                      to={`/${toLinkCase(title)}/${toLinkCase(item)}`}
                      onClick={() => {
                        document.querySelector('main')?.scrollTo(0, 0)
                        setSidebarOpen(false)
                      }}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Scrollbars>
      </aside>
    </>
  )
}

export default Sidebar
