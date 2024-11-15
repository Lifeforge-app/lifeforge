import { Icon } from '@iconify/react'
import React from 'react'
import Button from '@components/ButtonsAndInputs/Button'

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

    const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2))
    const endPage = Math.min(totalPages, startPage + pagesToShow - 1)

    if (startPage > 1) {
      if (startPage > 2) {
        pageNumbers.push(
          <>
            <button
              key={1}
              onClick={() => {
                onPageChange(1)
              }}
              className={`rounded-md px-3 py-2  ${
                currentPage === 1
                  ? 'font-semibold text-custom-500'
                  : 'text-bg-500 hover:bg-bg-200 dark:hover:bg-bg-800'
              }`}
            >
              {1}
            </button>
            <Icon icon="uil:ellipsis-h" className="text-bg-500" />
          </>
        )
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => {
            onPageChange(i)
          }}
          className={`rounded-md px-5 py-3  ${
            currentPage === i
              ? 'font-semibold text-custom-500'
              : 'text-bg-500 hover:bg-bg-200 dark:hover:bg-bg-800'
          }`}
        >
          {i}
        </button>
      )
    }

    if (endPage < totalPages) {
      pageNumbers.push(
        <>
          {endPage < totalPages && (
            <Icon icon="uil:ellipsis-h" className="text-bg-500" />
          )}
          <button
            key={totalPages}
            onClick={() => {
              onPageChange(totalPages)
            }}
            className={`rounded-md px-5 py-3  ${
              currentPage === totalPages
                ? 'font-semibold text-custom-500'
                : 'text-bg-500 hover:bg-bg-200 dark:hover:bg-bg-800'
            }`}
          >
            {totalPages}
          </button>
        </>
      )
    }

    return pageNumbers
  }

  return (
    <div className={`flex-between flex gap-2 ${className}`}>
      {currentPage > 1 ? (
        <Button
          onClick={() => {
            if (currentPage > 1) {
              onPageChange(currentPage - 1)
            }
          }}
          icon="uil:angle-left"
          variant="no-bg"
        >
          Previous
        </Button>
      ) : (
        <span className="w-32"></span>
      )}
      <div className="flex items-center gap-2">{renderPageNumbers()}</div>
      {currentPage < totalPages ? (
        <Button
          onClick={() => {
            if (currentPage < totalPages) {
              onPageChange(currentPage + 1)
            }
          }}
          icon="uil:angle-right"
          variant="no-bg"
          iconAtEnd
        >
          Next
        </Button>
      ) : (
        <span className="w-32"></span>
      )}
    </div>
  )
}

export default Pagination
