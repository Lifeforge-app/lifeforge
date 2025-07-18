import { Button } from '@components/buttons'
import { Icon } from '@iconify/react'
import clsx from 'clsx'

function Pagination({
  currentPage,
  onPageChange,
  totalPages,
  className = ''
}: {
  totalPages: number
  onPageChange: (page: number) => void
  currentPage: number
  className?: string
}): React.ReactElement {
  const renderPageNumbers = (): React.ReactElement[] => {
    const pageNumbers: React.ReactElement[] = []

    const pagesToShow = 5

    const startPage = Math.max(
      (() => {
        if (currentPage > totalPages - pagesToShow) {
          return totalPages - pagesToShow + 1
        }

        if (currentPage < pagesToShow) {
          return 1
        }

        return currentPage - Math.floor(pagesToShow / 2)
      })(),
      1
    )

    const endPage = Math.min(totalPages, startPage + pagesToShow - 1)

    if (startPage > 2) {
      pageNumbers.push(
        <>
          <button
            key={1}
            className={clsx(
              'hidden rounded-md px-3 py-2 lg:block',
              currentPage === 1
                ? 'text-custom-500 font-semibold'
                : 'text-bg-500 hover:bg-bg-200 dark:hover:bg-bg-800'
            )}
            onClick={() => {
              onPageChange(1)
            }}
          >
            {1}
          </button>
          <Icon className="text-bg-500 hidden lg:block" icon="uil:ellipsis-h" />
        </>
      )
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={clsx(
            'rounded-md px-5 py-3',
            currentPage === i
              ? 'lg:text-custom-500 font-semibold'
              : 'text-bg-500 hover:bg-bg-200 dark:hover:bg-bg-800 hidden lg:block'
          )}
          onClick={() => {
            onPageChange(i)
          }}
        >
          <span className="inline lg:hidden">Page </span>
          {i}
          <span className="inline lg:hidden"> / {totalPages}</span>
        </button>
      )
    }

    if (endPage < totalPages) {
      pageNumbers.push(
        <>
          {endPage < totalPages - 1 && (
            <Icon
              className="text-bg-500 hidden lg:block"
              icon="uil:ellipsis-h"
            />
          )}
          <button
            key={totalPages}
            className={clsx(
              'hidden rounded-md px-5 py-3 lg:block',
              currentPage === totalPages
                ? 'text-custom-500 font-semibold'
                : 'text-bg-500 hover:bg-bg-200 dark:hover:bg-bg-800'
            )}
            onClick={() => {
              onPageChange(totalPages)
            }}
          >
            {totalPages}
          </button>
        </>
      )
    }

    return pageNumbers
  }

  return (
    <div className={clsx('flex-between flex gap-2', className)}>
      {currentPage !== 1 ? (
        <>
          <Button
            className={clsx('hidden w-32 sm:flex')}
            disabled={currentPage === 1}
            icon="uil:angle-left"
            variant="plain"
            onClick={() => {
              if (currentPage > 1) {
                onPageChange(currentPage - 1)
              }
            }}
          >
            Previous
          </Button>
          <Button
            className={clsx('w-12 sm:hidden')}
            icon="uil:angle-left"
            variant="plain"
            onClick={() => {
              if (currentPage > 1) {
                onPageChange(currentPage - 1)
              }
            }}
          />
        </>
      ) : (
        <span className="w-12 sm:w-32"></span>
      )}
      <div className="flex items-center gap-2">{renderPageNumbers()}</div>
      {currentPage < totalPages ? (
        <>
          <Button
            iconAtEnd
            className={clsx('w-12 sm:hidden')}
            icon="uil:angle-right"
            variant="plain"
            onClick={() => {
              if (currentPage < totalPages) {
                onPageChange(currentPage + 1)
              }
            }}
          />
          <Button
            iconAtEnd
            className={clsx('hidden w-32 sm:flex')}
            disabled={currentPage === totalPages}
            icon="uil:angle-right"
            variant="plain"
            onClick={() => {
              if (currentPage < totalPages) {
                onPageChange(currentPage + 1)
              }
            }}
          >
            Next
          </Button>
        </>
      ) : (
        <span className="w-12 sm:w-32"></span>
      )}
    </div>
  )
}

export default Pagination
