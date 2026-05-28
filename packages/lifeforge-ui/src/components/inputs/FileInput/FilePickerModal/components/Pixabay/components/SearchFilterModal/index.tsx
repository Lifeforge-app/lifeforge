import { Button } from '@components/inputs'
import { ModalHeader, ModalWrapper } from '@components/overlays'
import { Flex } from '@components/primitives'

import {
  type IPixabaySearchFilter,
  type PixabaySearchFilterAction
} from '../../typescript/pixabay_interfaces'
import {
  CategoryFilter,
  ColorFilter,
  EditorsChoiceSwitch,
  ImageTypeFilter
} from './components'

export function SearchFilterModal({
  isOpen,
  onClose,
  filters,
  updateFilters
}: {
  isOpen: boolean
  onClose: () => void
  filters: IPixabaySearchFilter
  updateFilters: React.ActionDispatch<[action: PixabaySearchFilterAction]>
}) {
  return (
    <ModalWrapper isOpen={isOpen} minWidth="30vw" zIndex={1010}>
      <ModalHeader
        icon="tabler:filter"
        title="Search Filters"
        onClose={onClose}
      />
      <Flex direction="column" style={{ gap: '0.75rem' }}>
        <ImageTypeFilter
          imageType={filters.imageType}
          updateFilters={updateFilters}
        />
        <CategoryFilter
          category={filters.category}
          updateFilters={updateFilters}
        />
        <ColorFilter colors={filters.colors} updateFilters={updateFilters} />
        <EditorsChoiceSwitch
          isEditorsChoice={filters.isEditorsChoice}
          updateFilters={updateFilters}
        />
      </Flex>
      <Button
        icon="tabler:check"
        style={{ marginTop: '1.5rem', width: '100%' }}
        onClick={onClose}
      >
        Apply Filters
      </Button>
    </ModalWrapper>
  )
}
