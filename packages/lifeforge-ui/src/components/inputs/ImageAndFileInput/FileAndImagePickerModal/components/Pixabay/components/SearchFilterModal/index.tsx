import {
  type IPixabaySearchFilter,
  type PixabaySearchFilterAction
} from '@interfaces/pixabay_interfaces'

import { Button } from '@components/buttons'
import { ModalHeader, ModalWrapper } from '@components/modals'

import {
  CategoryFilter,
  ColorFilter,
  EditorsChoiceSwitch,
  ImageTypeFilter
} from './components'

function SearchFilterModal({
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
      <div className="space-y-4">
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
      </div>
      <Button className="mt-6" icon="tabler:check" onClick={onClose}>
        Apply Filters
      </Button>
    </ModalWrapper>
  )
}

export default SearchFilterModal
