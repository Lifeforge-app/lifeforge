import { Icon } from '@iconify/react'
import { useEffect } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { useLocation } from 'shared'

import NavigationBar from './components/NavigationBar'

function Boilerplate({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  useEffect(() => {
    const hash = location.hash

    if (hash) {
      const element = document.getElementById(hash.slice(1))

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else {
      document
        .querySelector('section')
        ?.parentElement?.parentElement?.scrollTo(0, 0)
    }
  }, [location])

  return (
    <article className="relative h-full min-h-0 flex-1 overflow-y-auto p-6 !pb-0 sm:p-12 xl:ml-[18rem]">
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
        <div className="flex h-full w-full min-w-0 flex-col sm:pl-8 lg:w-[calc(100%-20rem)]">
          {children}
          <NavigationBar />
          <hr className="border-bg-200 dark:border-bg-800 my-12 border-t-[1.5px]" />
          <div className="flex flex-col items-center justify-center gap-2 pb-6 sm:pb-12">
            <div className="text-bg-500 flex items-center gap-2">
              <Icon className="size-6" icon="tabler:creative-commons" />
              <Icon className="size-6" icon="tabler:creative-commons-by" />
              <Icon className="size-6" icon="tabler:creative-commons-nc" />
              <Icon className="size-6" icon="tabler:creative-commons-sa" />
            </div>
            <p className="text-bg-500 text-center text-sm">
              A project by{' '}
              <a
                className="text-custom-500 underline"
                href="https://thecodeblog.net"
                rel="noreferrer"
                target="_blank"
              >
                Melvin Chia
              </a>{' '}
              licensed under{' '}
              <a
                className="text-custom-500 underline"
                href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                rel="noreferrer"
                target="_blank"
              >
                CC BY-NC-SA 4.0
              </a>
              .
            </p>
          </div>
        </div>
      </Scrollbars>
    </article>
  )
}

export default Boilerplate
