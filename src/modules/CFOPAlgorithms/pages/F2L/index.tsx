import React from 'react'
import { useNavigate } from 'react-router'
import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import Cube from './Cube'

function CFOPF2L(): React.ReactElement {
  const navigate = useNavigate()
  return (
    <ModuleWrapper>
      <header className="space-y-1">
        <GoBackButton
          onClick={() => {
            navigate('/cfop-algorithms')
          }}
        />
        <div className="flex-between flex">
          <h1 className="flex items-center gap-4 text-2xl font-semibold sm:text-3xl">
            <img
              src="/assets/cfop/landing-f2l.webp"
              alt="F2L"
              className="size-16"
            />
            First Two Layers
          </h1>
        </div>
      </header>
      <div className="flex-center flex w-full flex-1">
        <Cube />
      </div>
    </ModuleWrapper>
  )
}

export default CFOPF2L
