import { Icon } from '@iconify/react'
import clsx from 'clsx'

import { Button } from '@components/inputs'

interface PaginationProps {
  /** Current active page */
  page: number
  /** Callback function when the page is changed */
  onPageChange: (page: number | ((prevPage: number) => number)) => void
  /** Total number of pages */
  totalPages: number
  /** Additional class names for the pagination container */
  className?: string
}

function Pagination({
  page,
  onPageChange,
  totalPages,
  className = ''
}: PaginationProps): React.ReactElement {
  const renderPageNumbers = () => {
    const pageNumbers: React.ReactElement[] = []

    const pagesToShow = 5

    const startPage = Math.max(
      (() => {
        if (page > totalPages - pagesToShow) {
          return totalPages - pagesToShow + 1
        }

        if (page < pagesToShow) {
          return 1
        }

        return page - Math.floor(pagesToShow / 2)
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
              page === 1
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
            page === i
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
              page === totalPages
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
      {page !== 1 ? (
        <>
          <Button
            className="hidden w-32 sm:flex"
            disabled={page === 1}
            icon="uil:angle-left"
            variant="plain"
            onClick={() => {
              onPageChange(page => {
                if (page > 1) {
                  return page - 1
                }

                return page
              })
            }}
          >
            Previous
          </Button>
          <Button
            className="w-12 sm:hidden"
            icon="uil:angle-left"
            variant="plain"
            onClick={() => {
              onPageChange(page => {
                if (page > 1) {
                  return page - 1
                }

                return page
              })
            }}
          />
        </>
      ) : (
        <span className="w-12 sm:w-32"></span>
      )}
      <div className="flex items-center gap-2">{renderPageNumbers()}</div>
      {page < totalPages ? (
        <>
          <Button
            className="w-12 sm:hidden"
            icon="uil:angle-right"
            iconPosition="end"
            variant="plain"
            onClick={() => {
              onPageChange(page => {
                if (page < totalPages) {
                  return page + 1
                }

                return page
              })
            }}
          />
          <Button
            className="hidden w-32 sm:flex"
            disabled={page === totalPages}
            icon="uil:angle-right"
            iconPosition="end"
            variant="plain"
            onClick={() => {
              onPageChange(page => {
                if (page < totalPages) {
                  return page + 1
                }

                return page
              })
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
