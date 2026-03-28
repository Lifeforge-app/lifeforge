import React from 'react'

import { Flex } from '@components/primitives'

import EllipsisIcon from './EllipsisIcon'
import PageNumButton from './PageNumButton'

function PageNumbers({
  page,
  totalPages,
  onPageChange
}: {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
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
        <PageNumButton number={1} onClick={() => onPageChange(1)} />
        <EllipsisIcon />
      </>
    )
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(
      <PageNumButton
        key={i}
        active={i === page}
        number={i}
        onClick={() => {
          onPageChange(i)
        }}
      />
    )
  }

  if (endPage < totalPages) {
    pageNumbers.push(
      <>
        <EllipsisIcon />
        <PageNumButton
          number={totalPages}
          onClick={() => onPageChange(totalPages)}
        />
      </>
    )
  }

  return (
    <Flex align="center" gap="xs">
      {pageNumbers}
    </Flex>
  )
}

export default PageNumbers
