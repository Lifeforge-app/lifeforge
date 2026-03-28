import { Flex } from '@components/primitives'

import { NavButton } from './components/NavButton'
import PageNumbers from './components/PageNumbers'

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
  const previousPage = () => {
    onPageChange(prevPage => {
      if (prevPage > 1) {
        return prevPage - 1
      }

      return prevPage
    })
  }

  const nextPage = () => {
    onPageChange(prevPage => {
      if (prevPage < totalPages) {
        return prevPage + 1
      }

      return prevPage
    })
  }

  return (
    <Flex align="center" className={className} gap="sm" justify="between">
      <NavButton
        direction="previous"
        hidden={page === 1}
        onClick={previousPage}
      />
      <PageNumbers
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
      <NavButton
        direction="next"
        hidden={page === totalPages}
        onClick={nextPage}
      />
    </Flex>
  )
}

export default Pagination
