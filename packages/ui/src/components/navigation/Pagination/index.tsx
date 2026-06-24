import { Flex, type FlexProps } from '@/components/primitives'

import { NavButton } from './components/NavButton'
import { PageNumbers } from './components/PageNumbers'

interface PaginationProps extends FlexProps<'div'> {
  /** Current active page */
  page: number
  /** Callback function when the page is changed */
  onPageChange: (page: number) => void
  /** Total number of pages */
  totalPages: number
  /** Additional class names for the pagination container */
  className?: string
}

export function Pagination({
  page,
  onPageChange,
  totalPages,
  ...rest
}: PaginationProps): React.ReactElement {
  const previousPage = () => {
    onPageChange(Math.max(1, page - 1))
  }

  const nextPage = () => {
    onPageChange(Math.min(totalPages, page + 1))
  }

  return (
    <Flex align="center" gap="sm" justify="between" {...rest}>
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
