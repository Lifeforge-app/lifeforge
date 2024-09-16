import React from 'react'
import { useNavigate } from 'react-router'
import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import AlgEntry from './AlgEntry'
import { algsetScrambles } from '../../algorithms/PLL'
import { applyMoves, DEFAULT_CUBE } from '../../scripts/genCube'

function CFOPPLL(): React.ReactElement {
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
              src="/assets/cfop/landing-pll.webp"
              alt="PLL"
              className="size-16"
            />
            Permutation of the Last Layer
          </h1>
        </div>
      </header>
      <ul className="my-8 space-y-4">
        {algsetScrambles.map((algset, index) => {
          let cube = DEFAULT_CUBE
          cube = applyMoves(cube, algset[0])

          return <AlgEntry key={index} cube={cube} index={index} />
        })}
      </ul>
    </ModuleWrapper>
  )
}

export default CFOPPLL
