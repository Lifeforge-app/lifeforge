import { algo } from 'crypto-js'
import React from 'react'
import { useNavigate } from 'react-router'
import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import Cube from './Cube'

const ALGO: Array<{
  alg: string[]
  warn?: number[]
  pattern: string
}> = [
  {
    alg: ["U2 (R U R') U (R U' R')", "y F R U2 R' F'"],
    pattern: '--grr-rr- r---gg-gg ---r----w'
  },
  {
    alg: ["y U2 (L' U' L) U' (L' U L)", "F' L' U2 L F"],
    pattern: '--grr-rr- r---gg-gg -g------w'
  },
  {
    alg: ["U (R U2 R') U (R U' R')"],
    pattern: '--grr-rr- r---gg-gg -r------w'
  },
  {
    alg: ["y U' (L' U2 L) U' (L' U L)"],
    pattern: '--grr-rr- r---gg-gg ---g----w'
  },
  {
    alg: [
      "U (R U' R') U' (R U' R' U R U' R')",
      "U (F R' F' R) U (R U R')",
      "U2 (L F' L' F) (R U R')",
      "y U L' U' (L2 F' L' F) (L' U L)",
      "y F' (U' L' U L) F (L' U L)",
      "y' U2 R U' R' U' S R' S'"
    ],
    warn: [2, 5],
    pattern: '-ggrr-rr- r---gg-gg -------rw'
  },
  {
    alg: [
      "y U' (L' U L) U (L' U L U' L' U L)",
      "y U' (F' L F L') U' (L' U' L)",
      "y U2 (R F' R' F) (L' U' L)",
      "U' R U (R2' F R F') (R U' R')",
      "F (U R U' R') F' (R U' R')",
      "y2 U2 L' U L U S' L S"
    ],
    warn: [2, 5],
    pattern: '--grr-rr- rr--gg-gg -----g--w'
  },
  {
    alg: ["(R U2 R') U' (R U R')"],
    pattern: '--grr-rr- rg--gg-gg -----r--w'
  },
  {
    alg: ["y (L' U2 L) U (L' U' L)"],
    pattern: '-rgrr-rr- r---gg-gg -------gw'
  }
]

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
      <section className="mt-8 space-y-4">
        <p className="w-full text-center text-lg font-semibold tracking-wider text-custom-500">
          SECTION 1
        </p>
        <h2 className="text-center text-4xl font-semibold tracking-widest">
          BASIC F2L
        </h2>
        <h3 className="pt-8 text-center text-2xl font-semibold tracking-wider">
          1A. Both pieces are on top.
        </h3>
        <h4 className="pt-4 text-xl font-semibold tracking-wider">
          White sticker facing <span className="text-custom-500">UP</span>
        </h4>
      </section>
      <div className="mb-16 mt-4 grid grid-cols-2 gap-2">
        {ALGO.map(({ alg, pattern, warn }, i) => (
          <div
            key={i}
            className="flex w-full items-center gap-6 rounded-md bg-bg-50 p-4 shadow-custom dark:bg-bg-900"
          >
            <div className="rounded-md bg-bg-800/70 p-1 pb-2">
              <Cube pattern={pattern} />
            </div>
            <div className="space-y-2 text-lg font-medium">
              {alg.map((a, j) => (
                <p
                  key={a}
                  className={warn?.includes(j) === true ? 'text-red-400' : ''}
                >
                  {a}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ModuleWrapper>
  )
}

export default CFOPF2L
