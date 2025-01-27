import { Transition } from '@headlessui/react'
import React, { Fragment } from 'react'

function ListboxTransition({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  return (
    <Transition
      as={Fragment}
      enter="transition ease-in duration-100"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {children}
    </Transition>
  )
}

export default ListboxTransition
