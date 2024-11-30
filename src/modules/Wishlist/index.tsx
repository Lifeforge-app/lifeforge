import React, { useState } from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import FAB from '@components/ButtonsAndInputs/FAB'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import { type IWishlistList } from '@interfaces/wishlist_interfaces'
import ModifyWishlistListModal from './components/ModifyWishlistModal'
import WishlistListItem from './components/WishlistListItem'

function Wishlist(): React.ReactElement {
  const [lists, refreshLists] = useFetch<IWishlistList[]>('wishlist/lists')
  const [existedData, setExistedData] = useState<IWishlistList | null>(null)
  const [modifyWishlistListModalOpenType, setModifyWishlistListModalOpenType] =
    useState<'create' | 'update' | null>(null)

  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Wishlist"
        icon="tabler:heart"
        actionButton={
          <Button
            className="hidden md:flex"
            icon="tabler:plus"
            onClick={() => {
              setModifyWishlistListModalOpenType('create')
            }}
          >
            New Wishlist
          </Button>
        }
      />
      <APIComponentWithFallback data={lists}>
        {lists => {
          return (
            <div className="mt-6 space-y-4">
              {lists.map(list => (
                <WishlistListItem
                  key={list.id}
                  list={list}
                  setExistedData={setExistedData}
                  setModifyWishlistListModalOpenType={
                    setModifyWishlistListModalOpenType
                  }
                />
              ))}
            </div>
          )
        }}
      </APIComponentWithFallback>
      <ModifyWishlistListModal
        openType={modifyWishlistListModalOpenType}
        setOpenType={setModifyWishlistListModalOpenType}
        updateWishlistList={refreshLists}
        existedData={existedData}
      />
      <FAB
        icon="tabler:plus"
        onClick={() => {
          setModifyWishlistListModalOpenType('create')
        }}
        hideWhen="md"
      />
    </ModuleWrapper>
  )
}

export default Wishlist
