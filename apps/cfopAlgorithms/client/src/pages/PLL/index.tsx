import { GoBackButton } from 'lifeforge-ui'
import { useNavigate } from 'react-router'

import { algsetScrambles } from '../../algorithms/PLL'
import { DEFAULT_CUBE, applyMoves } from '../../functions/genCube'
import AlgEntry from './AlgEntry'

function CFOPPLL() {
  const navigate = useNavigate()

  return (
    <>
      <header className="space-y-1">
        <GoBackButton
          onClick={() => {
            navigate('/cfop-algorithms')
          }}
        />
        <div className="flex-between flex">
          <h1 className="flex items-center gap-3 text-2xl font-semibold sm:text-3xl">
            <img
              alt="PLL"
              className="size-16"
              src="/assets/apps/CFOPAlgorithms/landing-pll.webp"
            />
            Permutation of the Last Layer
          </h1>
        </div>
      </header>
      <ul className="my-8 space-y-3">
        {algsetScrambles.map((algset, index) => {
          let cube = DEFAULT_CUBE
          cube = applyMoves(cube, algset[0])

          return <AlgEntry key={index} cube={cube} index={index} />
        })}
      </ul>
    </>
  )
}

export default CFOPPLL
