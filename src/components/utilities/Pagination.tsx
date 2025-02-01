import { Icon } from '@iconify/react'
import React from 'react'
import { Button } from '@components/buttons'

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

    if (startPage > 1) {
      if (startPage > 2) {
        pageNumbers.push(
          <>
            <button
              key={1}
              onClick={() => {
                onPageChange(1)
              }}
              className={`hidden rounded-md px-3 py-2 lg:block  ${
                currentPage === 1
                  ? 'font-semibold text-custom-500'
                  : 'text-bg-500 hover:bg-bg-200 dark:hover:bg-bg-800'
              }`}
            >
              {1}
            </button>
            <Icon
              icon="uil:ellipsis-h"
              className="hidden text-bg-500 lg:block"
            />
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
              ? 'font-semibold lg:text-custom-500'
              : 'hidden text-bg-500 hover:bg-bg-200 dark:hover:bg-bg-800 lg:block'
          }`}
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
              icon="uil:ellipsis-h"
              className="hidden text-bg-500 lg:block"
            />
          )}
          <button
            key={totalPages}
            onClick={() => {
              onPageChange(totalPages)
            }}
            className={`hidden rounded-md px-5 py-3 lg:block  ${
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
      {currentPage !== 1 ? (
        <>
          <Button
            disabled={currentPage === 1}
            onClick={() => {
              if (currentPage > 1) {
                onPageChange(currentPage - 1)
              }
            }}
            icon="uil:angle-left"
            variant="no-bg"
            className="hidden sm:flex w-32"
          >
            Previous
          </Button>
          <Button
            onClick={() => {
              if (currentPage > 1) {
                onPageChange(1)
              }
            }}
            icon="uil:angle-left"
            variant="no-bg"
            className="sm:hidden"
          />
        </>
      ) : (
        <span className="w-32"></span>
      )}
      <div className="flex items-center gap-2">{renderPageNumbers()}</div>
      {currentPage < totalPages ? (
        <>
          <Button
            onClick={() => {
              if (currentPage < totalPages) {
                onPageChange(totalPages)
              }
            }}
            icon="uil:angle-right"
            variant="no-bg"
            className="sm:hidden"
            iconAtEnd
          />
          <Button
            disabled={currentPage === totalPages}
            onClick={() => {
              if (currentPage < totalPages) {
                onPageChange(currentPage + 1)
              }
            }}
            icon="uil:angle-right"
            variant="no-bg"
            className="hidden sm:flex w-32"
            iconAtEnd
          >
            Next
          </Button>
        </>
      ) : (
        <span className="w-32"></span>
      )}
    </div>
  )
}

export default Pagination
