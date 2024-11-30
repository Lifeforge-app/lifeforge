import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'
import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import useFetch from '@hooks/useFetch'
import { type IWishlistList } from '@interfaces/wishlist_interfaces'

function WishlistEntries(): React.ReactElement {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [valid] = useFetch<boolean>(`wishlist/lists/valid/${id}`)
  const [wishlistListDetails] = useFetch<IWishlistList>(
    `wishlist/lists/${id}`,
    valid === true
  )

  useEffect(() => {
    if (typeof valid === 'boolean' && !valid) {
      toast.error('Invalid ID')
      navigate('/wishlist')
    }
  }, [valid])

  return (
    <ModuleWrapper>
      <header className="space-y-1">
        <GoBackButton
          onClick={() => {
            navigate('/wishlist')
          }}
        />
        <div className="flex-between flex">
          <h1
            className={`flex items-center gap-4 ${
              typeof wishlistListDetails !== 'string'
                ? 'text-2xl sm:text-3xl'
                : 'text-2xl'
            } font-semibold `}
          >
            {(() => {
              switch (wishlistListDetails) {
                case 'loading':
                  return (
                    <>
                      <span className="small-loader-light"></span>
                      Loading...
                    </>
                  )
                case 'error':
                  return (
                    <>
                      <Icon
                        icon="tabler:alert-triangle"
                        className="mt-0.5 size-7 text-red-500"
                      />
                      Failed to fetch data from server.
                    </>
                  )
                default:
                  return (
                    <>
                      <div
                        className="rounded-lg p-3"
                        style={{
                          backgroundColor: wishlistListDetails.color + '20'
                        }}
                      >
                        <Icon
                          icon={wishlistListDetails.icon}
                          className="text-2xl sm:text-3xl"
                          style={{
                            color: wishlistListDetails.color
                          }}
                        />
                      </div>
                      {wishlistListDetails.name}
                    </>
                  )
              }
            })()}
          </h1>
        </div>
      </header>
    </ModuleWrapper>
  )
}

export default WishlistEntries
