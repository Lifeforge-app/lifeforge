import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState } from 'react'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import { type IWalletCategoryEntry } from '@typedec/Wallet'
import ModifyCategoriesModal from './ModifyCategoriesModal'

function ManageCategoriesModal({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}): React.ReactElement {
  const [categories, refreshCategories] = useFetch<IWalletCategoryEntry[]>(
    'wallet/category/list'
  )
  const [modifyCategoriesModalOpenType, setModifyCategoriesModalOpenType] =
    useState<'income' | 'expenses' | 'update' | null>(null)
  const [existedData, setExistedData] = useState<IWalletCategoryEntry | null>(
    null
  )
  const [
    deleteCategoriesConfirmationOpen,
    setDeleteCategoriesConfirmationOpen
  ] = useState(false)

  return (
    <>
      <Modal isOpen={isOpen} minWidth="40rem">
        <ModalHeader
          title="Manage Categories"
          icon="tabler:apps"
          onClose={onClose}
        />
        <APIComponentWithFallback data={categories}>
          {typeof categories !== 'string' && categories.length > 0 ? (
            <>
              <div className="flex items-center justify-between gap-4">
                <h2 className="flex items-center gap-2 text-lg font-medium text-bg-500">
                  <Icon icon="tabler:login-2" className="h-6 w-6" />
                  Income
                </h2>
                <button
                  onClick={() => {
                    setModifyCategoriesModalOpenType('income')
                  }}
                  className="rounded-lg p-2 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-800 dark:hover:text-bg-100"
                >
                  <Icon icon="tabler:plus" className="h-5 w-5" />
                </button>
              </div>
              <ul className="mb-4 flex flex-col divide-y divide-bg-200 dark:divide-bg-800">
                {categories.filter(category => category.type === 'income')
                  .length > 0 ? (
                  categories
                    .filter(category => category.type === 'income')
                    .map(category => (
                      <li
                        key={category.id}
                        className="flex items-center justify-between gap-4 px-2 py-4"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            style={{
                              backgroundColor: category.color + '20'
                            }}
                            className="rounded-md p-2"
                          >
                            <Icon
                              icon={category.icon}
                              className="h-6 w-6"
                              style={{
                                color: category.color
                              }}
                            />
                          </div>
                          <div className="font-semibold ">{category.name}</div>
                        </div>
                        <HamburgerMenu className="relative">
                          <MenuItem
                            icon="tabler:pencil"
                            text="Edit"
                            onClick={() => {
                              setExistedData(category)
                              setModifyCategoriesModalOpenType('update')
                            }}
                          />
                          <MenuItem
                            icon="tabler:trash"
                            text="Delete"
                            onClick={() => {
                              setExistedData(category)
                              setDeleteCategoriesConfirmationOpen(true)
                            }}
                            isRed
                          />
                        </HamburgerMenu>
                      </li>
                    ))
                ) : (
                  <p className="text-center text-bg-500">
                    No income categories found
                  </p>
                )}
              </ul>
              <div className="flex items-center justify-between gap-4">
                <h2 className="flex items-center gap-2 text-lg font-medium text-bg-500">
                  <Icon icon="tabler:logout" className="h-6 w-6" />
                  Expenses
                </h2>
                <button
                  onClick={() => {
                    setModifyCategoriesModalOpenType('expenses')
                  }}
                  className="rounded-lg p-2 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-800 dark:hover:text-bg-100"
                >
                  <Icon icon="tabler:plus" className="h-5 w-5" />
                </button>
              </div>
              <ul className="flex flex-col divide-y divide-bg-200 dark:divide-bg-800">
                {categories
                  .filter(category => category.type === 'expenses')
                  .map(category => (
                    <li
                      key={category.id}
                      className="flex items-center justify-between gap-4 px-2 py-4"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          style={{
                            backgroundColor: category.color + '20'
                          }}
                          className="rounded-md p-2"
                        >
                          <Icon
                            icon={category.icon}
                            className="h-6 w-6"
                            style={{
                              color: category.color
                            }}
                          />
                        </div>
                        <div className="font-semibold ">{category.name}</div>
                      </div>
                      <HamburgerMenu className="relative">
                        <MenuItem
                          icon="tabler:pencil"
                          text="Edit"
                          onClick={() => {
                            setExistedData(category)
                            setModifyCategoriesModalOpenType('update')
                          }}
                        />
                        <MenuItem
                          icon="tabler:trash"
                          text="Delete"
                          onClick={() => {
                            setExistedData(category)
                            setDeleteCategoriesConfirmationOpen(true)
                          }}
                          isRed
                        />
                      </HamburgerMenu>
                    </li>
                  ))}
              </ul>
            </>
          ) : (
            <EmptyStateScreen
              icon="tabler:apps-off"
              title="Oops, no categories found"
              description="Create a new category to get started"
              ctaContent="Create Category"
              setModifyModalOpenType={() => {
                setModifyCategoriesModalOpenType('income')
              }}
            />
          )}
        </APIComponentWithFallback>
      </Modal>
      <ModifyCategoriesModal
        existedData={existedData}
        setExistedData={setExistedData}
        refreshCategories={refreshCategories}
        openType={modifyCategoriesModalOpenType}
        setOpenType={setModifyCategoriesModalOpenType}
      />
      <DeleteConfirmationModal
        isOpen={deleteCategoriesConfirmationOpen}
        onClose={() => {
          setDeleteCategoriesConfirmationOpen(false)
        }}
        apiEndpoint="wallet/category/delete"
        data={existedData}
        updateDataList={refreshCategories}
        nameKey="name"
        itemName="category"
      />
    </>
  )
}

export default ManageCategoriesModal
