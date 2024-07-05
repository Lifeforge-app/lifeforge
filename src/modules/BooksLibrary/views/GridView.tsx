import React from 'react'
import Scrollbar from '@components/Scrollbar'

function GridView({ books }: { books: any[] }): React.ReactElement {
  return (
    <Scrollbar className="mt-6">
      <ul className="grid min-h-0 gap-6 px-4 sm:grid-cols-2 md:grid-cols-3">
        {books.map((item: any) => (
          <li
            key={item.id}
            className="relative flex flex-col items-start rounded-lg"
          >
            <div className="flex-center flex h-72 w-full rounded-lg bg-bg-50 p-8 shadow-custom dark:bg-bg-900">
              <img
                src={`${import.meta.env.VITE_API_HOST}/books-library/cover/${
                  item.cover
                }`}
                className="h-full"
              />
            </div>
            <div className="mt-4 text-xl font-medium">{item.title}</div>
            <div className="mt-2 text-sm font-medium text-bg-500">
              {item.authors}
            </div>
          </li>
        ))}
      </ul>
    </Scrollbar>
  )
}

export default GridView
