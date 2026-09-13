import {
  Button,
  ModalHeader,
  Stack,
  WithQueryData,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import ModifyCategoryModal from '../ModifyCategoryModal'
import CategoryList from './components/CategoryList'
import { CategoriesTabbedView } from './constants/tabbed_view'

function ManageCategoriesModal({ onClose }: { onClose: () => void }) {
  const { open } = useModalStore()

  return (
    <Stack minHeight="80vh" minWidth="40vw">
      <ModalHeader
        icon="tabler:apps"
        title="categories.manage"
        trailing={
          <Button
            icon="tabler:plus"
            variant="plain"
            onClick={() => open(ModifyCategoryModal, { type: 'create' })}
          />
        }
        onClose={onClose}
      />
      <CategoriesTabbedView.Root>
        <CategoriesTabbedView.Selector />
        <WithQueryData contract={forgeAPI.categories.list}>
          {categories => <CategoryList categories={categories} />}
        </WithQueryData>
      </CategoriesTabbedView.Root>
    </Stack>
  )
}

export default ManageCategoriesModal
