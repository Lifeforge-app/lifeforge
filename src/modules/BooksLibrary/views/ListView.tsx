import React from 'react'
import Scrollbar from '@components/Scrollbar'

function ListView({ books }: { books: any[] }): React.ReactElement {
  return (
    <Scrollbar className="mt-6">
      <ul className="space-y-4 px-4 pb-8">
        {books.map((item: any) => (
          <li
            key={item.id}
            className="relative flex items-center gap-4 rounded-lg bg-bg-50 p-4 shadow-custom dark:bg-bg-900"
          >
            <div className="flex-center flex size-20 rounded-lg bg-bg-200 p-2 dark:bg-bg-800">
              <img
                src={`${import.meta.env.VITE_API_HOST}/books-library/cover/${
                  item.cover
                }`}
                className="h-full"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="text-lg font-semibold">{item.title}</div>
              <div className="text-sm font-medium text-bg-500">
                {item.authors}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Scrollbar>
  )
}

export default ListView
